from ultralytics import YOLO
import cv2
import json
import os
from datetime import datetime
from app.config.database import get_supabase

# Cargar modelo YOLO
model = YOLO("yolo11l.pt")

TABLE_NAMES = ["dining table", "desk", "table", "bench"]

def iou(a, b):
    """Calcular Intersection over Union entre dos cajas"""
    ax1, ay1, ax2, ay2 = a
    bx1, by1, bx2, by2 = b

    inter_x1 = max(ax1, bx1)
    inter_y1 = max(ay1, by1)
    inter_x2 = min(ax2, bx2)
    inter_y2 = min(ay2, by2)

    if inter_x2 < inter_x1 or inter_y2 < inter_y1:
        return 0.0

    inter_area = (inter_x2 - inter_x1) * (inter_y2 - inter_y1)
    area_a = (ax2 - ax1) * (ay2 - ay1)
    area_b = (bx2 - bx1) * (by2 - by1)

    return inter_area / float(area_a + area_b - inter_area)

def persona_en_mesa(person_box, table_box):
    """Determinar si una persona está ocupando una mesa"""
    px1, py1, px2, py2 = person_box
    tx1, ty1, tx2, ty2 = table_box

    inter_x1 = max(px1, tx1)
    inter_y1 = max(py1, ty1)
    inter_x2 = min(px2, tx2)
    inter_y2 = min(py2, ty2)

    if inter_x2 <= inter_x1 or inter_y2 <= inter_y1:
        return False

    inter_area = (inter_x2 - inter_x1) * (inter_y2 - inter_y1)
    person_area = (px2 - px1) * (py2 - py1)

    return inter_area > 0.05 * person_area

def obtener_zona(y1, y2, zona1_y, zona2_y):
    """Determinar en qué zona está un objeto"""
    centro_y = (y1 + y2) // 2
    if centro_y < zona1_y:
        return 1
    elif centro_y < zona2_y:
        return 2
    else:
        return 3

def procesar_imagen(ubicacion_id: int, ruta_imagen: str, guardar_anotada: bool = True):
    """
    Procesar imagen con YOLO y guardar resultados en BD
    
    Args:
        ubicacion_id: ID de la ubicación en la BD
        ruta_imagen: Ruta a la imagen a procesar
        guardar_anotada: Si guardar imagen con anotaciones
    
    Returns:
        dict con resultados del procesamiento
    """
    try:
        supabase = get_supabase()
        
        # Verificar que existe la ubicación
        ubicacion_result = supabase.table("ubicacion").select("*").eq("id", ubicacion_id).execute()
        if not ubicacion_result.data:
            return {"error": "Ubicación no encontrada"}
        
        # Cargar imagen
        img = cv2.imread(ruta_imagen)
        if img is None:
            return {"error": "No se pudo cargar la imagen"}
        
        h, w = img.shape[:2]
        
        # Definir zonas
        zona1_y = h // 3
        zona2_y = (h * 2) // 3
        
        # Ejecutar predicción YOLO
        results = model.predict(
            source=img,
            conf=0.15,
            imgsz=2304,
            verbose=False
        )[0]
        
        # Detectar personas y mesas
        table_boxes = []
        person_boxes = []
        
        for box in results.boxes:
            cls = int(box.cls)
            name = results.names[cls]
            x1, y1, x2, y2 = box.xyxy[0].cpu().numpy().astype(int)
            
            if name == "person":
                person_boxes.append([x1, y1, x2, y2])
            
            if name in TABLE_NAMES:
                table_boxes.append([x1, y1, x2, y2])
        
        # Fusionar mesas duplicadas
        merged_tables = []
        used = set()
        
        for i in range(len(table_boxes)):
            if i in used:
                continue
            
            x1, y1, x2, y2 = table_boxes[i]
            
            for j in range(i + 1, len(table_boxes)):
                if j in used:
                    continue
                
                if iou(table_boxes[i], table_boxes[j]) > 0.30:
                    x1 = min(x1, table_boxes[j][0])
                    y1 = min(y1, table_boxes[j][1])
                    x2 = max(x2, table_boxes[j][2])
                    y2 = max(y2, table_boxes[j][3])
                    used.add(j)
            
            merged_tables.append([x1, y1, x2, y2])
        
        # Inicializar contadores por zona
        zonas = {
            1: {"personas": 0, "mesas_libres": 0},
            2: {"personas": 0, "mesas_libres": 0},
            3: {"personas": 0, "mesas_libres": 0}
        }
        
        # Crear imagen anotada si se solicita
        if guardar_anotada:
            annotated = img.copy()
            
            # Procesar mesas
            for table in merged_tables:
                x1, y1, x2, y2 = table
                zona = obtener_zona(y1, y2, zona1_y, zona2_y)
                
                ocupada = any(persona_en_mesa(p, table) for p in person_boxes)
                
                if ocupada:
                    color = (0, 0, 255)
                    estado = "Ocupada"
                else:
                    zonas[zona]["mesas_libres"] += 1
                    color = (0, 255, 0)
                    estado = "Libre"
                
                cv2.rectangle(annotated, (x1, y1), (x2, y2), color, 2)
                cv2.putText(annotated, f"{estado} Z{zona}", (x1, y1 - 5),
                           cv2.FONT_HERSHEY_SIMPLEX, 0.9, color, 2)
            
            # Procesar personas
            for x1, y1, x2, y2 in person_boxes:
                zona = obtener_zona(y1, y2, zona1_y, zona2_y)
                zonas[zona]["personas"] += 1
                
                cv2.rectangle(annotated, (x1, y1), (x2, y2), (255, 0, 0), 2)
                cv2.putText(annotated, f"person Z{zona}", (x1, y1 - 5),
                           cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 0, 0), 2)
            
            # Dibujar líneas de división
            cv2.line(annotated, (0, zona1_y), (w, zona1_y), (0, 255, 255), 2)
            cv2.line(annotated, (0, zona2_y), (w, zona2_y), (0, 255, 255), 2)
            
            # Guardar imagen anotada
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            ruta_anotada = f"resultados/anotada_{ubicacion_id}_{timestamp}.jpg"
            os.makedirs("resultados", exist_ok=True)
            cv2.imwrite(ruta_anotada, annotated)
        else:
            # Solo contar sin crear imagen
            for table in merged_tables:
                x1, y1, x2, y2 = table
                zona = obtener_zona(y1, y2, zona1_y, zona2_y)
                ocupada = any(persona_en_mesa(p, table) for p in person_boxes)
                if not ocupada:
                    zonas[zona]["mesas_libres"] += 1
            
            for x1, y1, x2, y2 in person_boxes:
                zona = obtener_zona(y1, y2, zona1_y, zona2_y)
                zonas[zona]["personas"] += 1
            
            ruta_anotada = ruta_imagen
        
        # Guardar en base de datos
        # 1. Crear registro de captura
        captura_data = {
            "ubicacion_id": ubicacion_id,
            "ruta_imagen": ruta_anotada
        }
        captura_result = supabase.table("captura").insert(captura_data).execute()
        captura_id = captura_result.data[0]["id"]
        
        # 2. Crear registros de conteo por zona
        conteos_data = []
        for zona_num, datos in zonas.items():
            conteos_data.append({
                "captura_id": captura_id,
                "zona": zona_num,
                "personas": datos["personas"],
                "mesas_libres": datos["mesas_libres"]
            })
        
        supabase.table("conteo").insert(conteos_data).execute()
        
        # Preparar respuesta
        total_personas = sum(z["personas"] for z in zonas.values())
        total_mesas_libres = sum(z["mesas_libres"] for z in zonas.values())
        
        resultado = {
            "success": True,
            "captura_id": captura_id,
            "ubicacion_id": ubicacion_id,
            "ubicacion_nombre": ubicacion_result.data[0]["nombre"],
            "sede": ubicacion_result.data[0]["sede"],
            "fecha_hora": datetime.now().isoformat(),
            "ruta_imagen_anotada": ruta_anotada if guardar_anotada else None,
            "total_personas": total_personas,
            "total_mesas_libres": total_mesas_libres,
            "zonas": zonas
        }
        
        print("\n===== PROCESAMIENTO COMPLETADO =====")
        print(json.dumps(resultado, indent=2, ensure_ascii=False))
        
        return resultado
        
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }
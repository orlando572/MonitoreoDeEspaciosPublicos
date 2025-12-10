from ultralytics import YOLO
import cv2
import json

model = YOLO("yolo11l.pt")

image_path = "IMG_20251203_081827.jpg"
img = cv2.imread(image_path)

if img is None:
    print("No se encontró la imagen.")
    exit()

# ------------------------------
# PREDICCIÓN YOLO
# ------------------------------
results = model.predict(
    source=img,
    conf=0.15,
    imgsz=2304,
    verbose=False
)[0]

TABLE_NAMES = ["dining table", "desk", "table", "bench"]

# ------------------------------
# DIVISIÓN EN 3 ZONAS
# ------------------------------
h, w = img.shape[:2]

zona1_y = h // 3
zona2_y = (h * 2) // 3

def obtener_zona(y1, y2):
    centro_y = (y1 + y2) // 2
    if centro_y < zona1_y:
        return 1
    elif centro_y < zona2_y:
        return 2
    else:
        return 3

# ------------------------------
# DETECCIÓN DE PERSONAS Y MESAS
# ------------------------------
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

# ------------------------------
# FUSIONAR MESAS DUPLICADAS
# ------------------------------
def iou(a, b):
    ax1, ay1, ax2, ay2 = a
    bx1, by1, bx2, by2 = b

    inter_x1 = max(ax1, bx1)
    inter_y1 = max(ay1, by1)
    inter_x2 = min(ax2, bx2)
    inter_y2 = min(ay2, by2)

    if inter_x2 < inter_x1 or inter_y2 < inter_y1:
        return 0.0

    interArea = (inter_x2 - inter_x1) * (inter_y2 - inter_y1)
    areaA = (ax2 - ax1) * (ay2 - ay1)
    areaB = (bx2 - bx1) * (by2 - by1)

    return interArea / float(areaA + areaB - interArea)

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

# ------------------------------
# FUNCION PARA SABER SI UNA MESA ESTA OCUPADA
# ------------------------------
def persona_en_mesa(person_box, table_box):
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

# ------------------------------
# CONTADORES POR ZONA
# ------------------------------
zonas = {
    1: {"personas": 0, "mesas": 0},
    2: {"personas": 0, "mesas": 0},
    3: {"personas": 0, "mesas": 0}
}

annotated = img.copy()

# ------------------------------
# PROCESAR MESAS
# ------------------------------
for table in merged_tables:
    x1, y1, x2, y2 = table
    zona = obtener_zona(y1, y2)

    ocupada = any(persona_en_mesa(p, table) for p in person_boxes)

    if ocupada:
        color = (0, 0, 255)
        estado = "Ocupada"
    else:
        zonas[zona]["mesas"] += 1   # SOLO SUMA SI ES LIBRE
        color = (0, 255, 0)
        estado = "Libre"

    cv2.rectangle(annotated, (x1, y1), (x2, y2), color, 2)
    cv2.putText(annotated, f"{estado} Z{zona}", (x1, y1 - 5),
                cv2.FONT_HERSHEY_SIMPLEX, 0.9, color, 2)

# ------------------------------
# PROCESAR PERSONAS
# ------------------------------
for x1, y1, x2, y2 in person_boxes:
    zona = obtener_zona(y1, y2)
    zonas[zona]["personas"] += 1

    cv2.rectangle(annotated, (x1, y1), (x2, y2), (255, 0, 0), 2)
    cv2.putText(annotated, f"person Z{zona}", (x1, y1 - 5),
                cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 0, 0), 2)

# ------------------------------
# LINEAS DE DIVISIÓN
# ------------------------------
cv2.line(annotated, (0, zona1_y), (w, zona1_y), (0, 255, 255), 2)
cv2.line(annotated, (0, zona2_y), (w, zona2_y), (0, 255, 255), 2)

# ------------------------------
# GUARDAR
# ------------------------------
cv2.imwrite("resultado_final.jpg", annotated)

with open("resultado_zonas.json", "w") as f:
    json.dump(zonas, f, indent=4)

print("\n===== RESULTADOS POR ZONA =====")
print(json.dumps(zonas, indent=4))
print("Imagen guardada como resultado_final.jpg")
print("JSON guardado como resultado_zonas.json")

from fastapi import APIRouter, HTTPException
from app.config.database import get_supabase

router = APIRouter(prefix="/api", tags=["Capturas"])

@router.get("/captura/ultima/{ubicacion_id}")
async def obtener_ultima_captura(ubicacion_id: int):
    """Obtener la última captura con conteos de una ubicación"""
    try:
        supabase = get_supabase()
        
        # Obtener información de la ubicación
        ubicacion = supabase.table("ubicacion").select("*").eq("id", ubicacion_id).execute()
        if not ubicacion.data:
            raise HTTPException(status_code=404, detail="Ubicación no encontrada")
        
        # Obtener la última captura
        captura_result = supabase.table("captura")\
            .select("*")\
            .eq("ubicacion_id", ubicacion_id)\
            .order("fecha_hora", desc=True)\
            .limit(1)\
            .execute()
        
        if not captura_result.data:
            return {
                "message": "No hay capturas disponibles para esta ubicación",
                "ubicacion": ubicacion.data[0]
            }
        
        captura = captura_result.data[0]
        
        # Obtener conteos de esta captura
        conteos_result = supabase.table("conteo")\
            .select("*")\
            .eq("captura_id", captura["id"])\
            .execute()
        
        # Calcular totales
        total_personas = sum(c["personas"] for c in conteos_result.data)
        total_mesas_libres = sum(c["mesas_libres"] for c in conteos_result.data)
        
        return {
            "id": captura["id"],
            "ubicacion_id": ubicacion_id,
            "ubicacion_nombre": ubicacion.data[0]["nombre"],
            "sede": ubicacion.data[0]["sede"],
            "fecha_hora": captura["fecha_hora"],
            "ruta_imagen": captura["ruta_imagen"],
            "total_personas": total_personas,
            "total_mesas_libres": total_mesas_libres,
            "conteos": conteos_result.data
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/captura/procesar/{ubicacion_id}")
async def procesar_imagen(ubicacion_id: int):
    """
    Endpoint para procesar una nueva imagen (simulado para MVP)
    En producción, aquí llamarías a tu script YOLO
    """
    try:
        supabase = get_supabase()
        
        # Verificar que existe la ubicación
        ubicacion = supabase.table("ubicacion").select("*").eq("id", ubicacion_id).execute()
        if not ubicacion.data:
            raise HTTPException(status_code=404, detail="Ubicación no encontrada")
        
        # SIMULACIÓN: En producción aquí ejecutarías tu script YOLO
        # Por ahora, insertamos datos de ejemplo
        
        # Crear registro de captura
        captura_data = {
            "ubicacion_id": ubicacion_id,
            "ruta_imagen": "ejemplo/imagen.jpg"
        }
        captura_result = supabase.table("captura").insert(captura_data).execute()
        captura_id = captura_result.data[0]["id"]
        
        # Insertar conteos de ejemplo por zona
        conteos_ejemplo = [
            {"captura_id": captura_id, "zona": 1, "personas": 8, "mesas_libres": 2},
            {"captura_id": captura_id, "zona": 2, "personas": 15, "mesas_libres": 0},
            {"captura_id": captura_id, "zona": 3, "personas": 9, "mesas_libres": 1}
        ]
        
        supabase.table("conteo").insert(conteos_ejemplo).execute()
        
        return {
            "message": "Imagen procesada exitosamente",
            "captura_id": captura_id
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
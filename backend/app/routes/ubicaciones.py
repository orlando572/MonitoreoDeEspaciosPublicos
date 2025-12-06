from fastapi import APIRouter, HTTPException
from app.config.database import get_supabase

router = APIRouter(prefix="/api", tags=["Ubicaciones"])

@router.get("/ubicaciones")
async def obtener_ubicaciones():
    """Obtener todas las ubicaciones"""
    try:
        supabase = get_supabase()
        result = supabase.table("ubicacion").select("*").execute()
        return result.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/ubicaciones/sede/{sede}")
async def obtener_ubicaciones_por_sede(sede: str):
    """Obtener ubicaciones de una sede específica"""
    try:
        supabase = get_supabase()
        result = supabase.table("ubicacion").select("*").eq("sede", sede).execute()
        return result.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
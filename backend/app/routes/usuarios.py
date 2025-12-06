from fastapi import APIRouter, HTTPException
from app.models.schemas import UsuarioActualizar, FeedbackCreate
from app.config.database import get_supabase

router = APIRouter(prefix="/api", tags=["Usuarios"])

@router.get("/usuario/{usuario_id}")
async def obtener_usuario(usuario_id: int):
    """Obtener información del usuario"""
    try:
        supabase = get_supabase()
        result = supabase.table("usuario").select("*").eq("id", usuario_id).execute()
        
        if not result.data:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")
        
        usuario = result.data[0]
        return {
            "id": usuario["id"],
            "nombre": usuario["nombre"],
            "email": usuario["email"],
            "celular": usuario["celular"],
            "foto_url": usuario["foto_url"]
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/usuario/{usuario_id}")
async def actualizar_usuario(usuario_id: int, datos: UsuarioActualizar):
    """Actualizar información del usuario"""
    try:
        supabase = get_supabase()
        update_data = {k: v for k, v in datos.dict().items() if v is not None}
        
        if not update_data:
            raise HTTPException(status_code=400, detail="No hay datos para actualizar")
        
        result = supabase.table("usuario")\
            .update(update_data)\
            .eq("id", usuario_id)\
            .execute()
        
        if not result.data:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")
        
        return {
            "message": "Usuario actualizado exitosamente",
            "usuario": result.data[0]
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/feedback/{usuario_id}")
async def crear_feedback(usuario_id: int, feedback: FeedbackCreate):
    """Enviar feedback"""
    try:
        supabase = get_supabase()
        data = {
            "usuario_id": usuario_id,
            "mensaje": feedback.mensaje
        }
        
        result = supabase.table("feedback").insert(data).execute()
        
        return {
            "message": "Feedback enviado exitosamente",
            "id": result.data[0]["id"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
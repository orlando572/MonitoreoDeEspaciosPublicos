from fastapi import APIRouter, HTTPException
from app.models.schemas import UsuarioRegistro, UsuarioLogin
from app.config.database import get_supabase

router = APIRouter(prefix="/api", tags=["Autenticación"])

@router.post("/registro")
async def registro(usuario: UsuarioRegistro):
    """Registrar nuevo usuario"""
    try:
        supabase = get_supabase()
        
        # Verificar si el email ya existe
        result = supabase.table("usuario").select("*").eq("email", usuario.email).execute()
        if result.data:
            raise HTTPException(status_code=400, detail="El email ya está registrado")
        
        # Insertar usuario
        data = {
            "nombre": usuario.nombre,
            "email": usuario.email,
            "password": usuario.password,
            "celular": usuario.celular
        }
        
        result = supabase.table("usuario").insert(data).execute()
        
        return {
            "message": "Usuario registrado exitosamente",
            "usuario": {
                "id": result.data[0]["id"],
                "nombre": result.data[0]["nombre"],
                "email": result.data[0]["email"]
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/login")
async def login(credenciales: UsuarioLogin):
    """Iniciar sesión"""
    try:
        supabase = get_supabase()
        
        result = supabase.table("usuario")\
            .select("*")\
            .eq("email", credenciales.email)\
            .eq("password", credenciales.password)\
            .execute()
        
        if not result.data:
            raise HTTPException(status_code=401, detail="Credenciales inválidas")
        
        usuario = result.data[0]
        return {
            "message": "Login exitoso",
            "usuario": {
                "id": usuario["id"],
                "nombre": usuario["nombre"],
                "email": usuario["email"],
                "celular": usuario["celular"],
                "foto_url": usuario["foto_url"]
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
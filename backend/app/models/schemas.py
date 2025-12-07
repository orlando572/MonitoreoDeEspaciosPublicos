from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class UsuarioRegistro(BaseModel):
    nombre: str
    email: EmailStr
    password: str
    celular: Optional[str] = None

class UsuarioLogin(BaseModel):
    email: EmailStr
    password: str

class UsuarioActualizar(BaseModel):
    nombre: Optional[str] = None
    email: Optional[EmailStr] = None
    celular: Optional[str] = None
    foto_url: Optional[str] = None

class UsuarioResponse(BaseModel):
    id: int
    nombre: str
    email: str
    celular: Optional[str]
    foto_url: Optional[str]

class FeedbackCreate(BaseModel):
    mensaje: str

class FeedbackResponse(BaseModel):
    id: int
    usuario_id: Optional[int]
    mensaje: str
    fecha: datetime

class UbicacionResponse(BaseModel):
    id: int
    nombre: str
    sede: str

class ConteoResponse(BaseModel):
    zona: int
    personas: int
    mesas_libres: int

class CapturaResponse(BaseModel):
    id: int
    ubicacion_id: int
    ubicacion_nombre: str
    sede: str
    fecha_hora: datetime
    total_personas: int
    total_mesas_libres: int
    conteos: List[ConteoResponse]

class CapturaCreate(BaseModel):
    ubicacion_id: int
    ruta_imagen: str
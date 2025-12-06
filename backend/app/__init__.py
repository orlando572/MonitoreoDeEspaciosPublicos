# app/__init__.py
"""
Sistema Inteligente de Monitoreo de Espacios Públicos Universitarios
"""

# app/config/__init__.py
from .database import get_supabase, supabase

__all__ = ['get_supabase', 'supabase']

# app/models/__init__.py
from .schemas import (
    UsuarioRegistro,
    UsuarioLogin,
    UsuarioActualizar,
    UsuarioResponse,
    FeedbackCreate,
    FeedbackResponse,
    UbicacionResponse,
    ConteoResponse,
    CapturaResponse,
    CapturaCreate
)

__all__ = [
    'UsuarioRegistro',
    'UsuarioLogin',
    'UsuarioActualizar',
    'UsuarioResponse',
    'FeedbackCreate',
    'FeedbackResponse',
    'UbicacionResponse',
    'ConteoResponse',
    'CapturaResponse',
    'CapturaCreate'
]

# app/routes/__init__.py
from . import auth, usuarios, ubicaciones, capturas

__all__ = ['auth', 'usuarios', 'ubicaciones', 'capturas']

# app/services/__init__.py
from .yolo_processor import procesar_imagen

__all__ = ['procesar_imagen']
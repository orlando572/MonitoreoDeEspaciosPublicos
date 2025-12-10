from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Importar routers
from app.routes import auth, usuarios, ubicaciones, capturas

app = FastAPI(
    title="Sistema Monitoreo Espacios UTP",
    description="API para monitorear espacios públicos universitarios",
    version="1.0.0"
)

# Configurar CORS para desarrollo
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registrar routers
app.include_router(auth.router)
app.include_router(usuarios.router)
app.include_router(ubicaciones.router)
app.include_router(capturas.router)

# Health check endpoints
@app.get("/")
async def root():
    return {
        "message": "API Sistema Monitoreo Espacios UTP",
        "version": "1.0.0",
        "status": "active"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
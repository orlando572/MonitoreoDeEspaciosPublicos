# Sistema de Monitoreo de Espacios - UTP

Este proyecto es una plataforma integral (web y móvil) diseñada para monitorear la ocupación de espacios públicos en la **Universidad Tecnológica del Perú (UTP)**, sedes Arequipa (Parra y Tacna). Utiliza Inteligencia Artificial para el conteo de personas y mesas libres en tiempo real mediante el análisis de imágenes de cámaras de seguridad.

## 🚀 Tecnologías Utilizadas

### Backend (API & IA)

  * **Python 3.11**
  * **FastAPI** 
  * **Supabase** 
  * **YOLO (Ultralytics) + OpenCV** 

### Frontend (Cliente Web)

  * **React + Vite**
  * **Tailwind CSS**
  * **Lucide React**

## 📋 Requisitos Previos

  * **Node.js** (v18 o superior)
  * **Python** (v3.10 o superior)
  * Una cuenta y proyecto configurado en **Supabase**.

## ⚙️ Instalación y Ejecución

Sigue estos pasos para levantar el entorno de desarrollo localmente.

### 1\. Configuración del Backend

1.  Navega al directorio del backend:

    ```bash
    cd backend
    ```

2.  Crea y activa un entorno virtual (recomendado):

    ```bash
    python -m venv venv
    # En Windows:
    .\venv\Scripts\activate
    # En Mac/Linux:
    source venv/bin/activate
    ```

3.  Instala las dependencias:

    ```bash
    pip install -r requirements.txt
    ```

4.  Configura las variables de entorno:
    Crea un archivo `.env` en la carpeta `backend` con tus credenciales de Supabase:

    ```env
    SUPABASE_URL=tu_url_de_supabase
    SUPABASE_KEY=tu_anon_key_de_supabase
    PORT=8000
    HOST=0.0.0.0
    ```

5.  Ejecuta el servidor:

    ```bash
    python run.py
    ```

    El servidor iniciará en `http://localhost:8000`.

### 2\. Configuración del Frontend

1.  Navega al directorio del frontend:

    ```bash
    cd frontend
    ```

2.  Instala las dependencias de Node:

    ```bash
    npm install
    ```

3.  Ejecuta la aplicación en modo desarrollo:

    ```bash
    npm run dev
    ```

    La aplicación estará disponible en `http://localhost:5173`.

-----

## 📱 Funcionalidades Principales

  * **Autenticación Segura:** Registro e inicio de sesión de usuarios validado contra Supabase.
  * **Selección de Sede:** Interfaz para navegar entre las sedes **Parra** y **Tacna**.
  * **Monitoreo en Tiempo Real:** Visualización de la ocupación actual, incluyendo número de personas y mesas disponibles.
  * **Perfil de Usuario:** Gestión de datos personales y opción para enviar feedback del sistema.

-----

## 🧠 Procesamiento de Imágenes (IA)

El sistema incluye un módulo CLI para procesar imágenes manualmente, simulando la captura de cámaras de seguridad.

**Uso del script de procesamiento:**

```bash
# Desde la carpeta backend
python procesar_imagen_cli.py <ubicacion_id> <ruta_de_la_imagen>
```

Este script detectará personas y mesas, calculará la ocupación por zonas y guardará los resultados automáticamente en la base de datos.

-----

## 📂 Estructura del Proyecto

```text
/
├── backend/                # Servidor FastAPI
│   ├── app/
│   │   ├── config/         # Configuración de base de datos
│   │   ├── models/         # Esquemas Pydantic
│   │   ├── routes/         # Endpoints de la API
│   │   └── services/       # Lógica de procesamiento YOLO
│   ├── procesar_imagen_cli.py  # Script CLI para IA
│   └── run.py              # Entry point del servidor
│
└── frontend/               # Cliente React
    ├── src/
    │   ├── components/     # Componentes de UI (Pantallas)
    │   ├── config/         # Configuración de API
    │   └── context/        # Contexto de Autenticación
    └── vite.config.js      # Configuración de Vite
```

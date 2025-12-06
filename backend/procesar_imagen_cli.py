"""
Script CLI para procesar imágenes con YOLO
Uso: python procesar_imagen_cli.py <ubicacion_id> <ruta_imagen>
"""

import sys
from app.services.yolo_processor import procesar_imagen

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Uso: python procesar_imagen_cli.py <ubicacion_id> <ruta_imagen>")
        print("Ejemplo: python procesar_imagen_cli.py 1 IMG_20251203_081827.jpg")
        sys.exit(1)
    
    ubicacion_id = int(sys.argv[1])
    ruta_imagen = sys.argv[2]
    
    print(f"\n🔄 Procesando imagen: {ruta_imagen}")
    print(f"📍 Ubicación ID: {ubicacion_id}\n")
    
    resultado = procesar_imagen(ubicacion_id, ruta_imagen)
    
    if resultado.get("success"):
        print("\n✅ Imagen procesada y guardada en BD exitosamente")
        print(f"📊 Total personas: {resultado['total_personas']}")
        print(f"🪑 Total mesas libres: {resultado['total_mesas_libres']}")
        print(f"🖼️  Imagen anotada: {resultado['ruta_imagen_anotada']}")
    else:
        print(f"\n❌ Error: {resultado.get('error')}")
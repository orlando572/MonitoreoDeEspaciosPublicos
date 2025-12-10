import { X, TriangleAlert, CheckCircle } from 'lucide-react';

const NotificationModal = ({ isOpen, onClose, type = 'error', title, message }) => {
  if (!isOpen) return null;

  // Configuración según el tipo de notificación
  const isError = type === 'error';
  const Icon = isError ? TriangleAlert : CheckCircle;
  const iconColor = isError ? 'text-red-600' : 'text-green-600';
  const defaultTitle = isError ? 'ERROR NOTIFICACIÓN' : 'ÉXITO';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop (Fondo oscuro transparente) */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>

      {/* Contenedor del Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-xs p-6 animate-in fade-in zoom-in duration-200">
        
        {/* Cabecera: Título y Botón Cerrar */}
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wide">
            {title || defaultTitle}
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors -mr-2 -mt-2 p-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cuerpo: Icono y Mensaje */}
        <div className="flex flex-col items-center text-center">
          <div className="mb-4">
            <Icon className={`w-12 h-12 ${iconColor}`} strokeWidth={1.5} />
          </div>
          
          <p className="text-gray-600 text-sm leading-relaxed px-2">
            {message}
          </p>
        </div>

      </div>
    </div>
  );
};

export default NotificationModal;
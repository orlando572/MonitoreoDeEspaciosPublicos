import { ArrowLeft, Bell, User, BellOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const NotificationsScreen = ({ onBack }) => {
  const { user } = useAuth();

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-sm h-screen bg-white shadow-2xl flex flex-col">
        
        <div className="bg-gradient-to-r from-purple-600 to-purple-500 px-6 py-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <button
                onClick={onBack}
                className="p-2 rounded-full hover:bg-white/20 transition"
              >
                <ArrowLeft className="w-6 h-6 text-white" />
              </button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-purple-600" />
                </div>
                <span className="text-white text-lg text-base font-medium">Hola, {user?.nombre?.split(' ')[0]}</span>
              </div>
            </div>
            </div>
          <h1 className="text-white text-2xl font-bold">Notificaciones</h1>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mb-6">
            <BellOff className="w-12 h-12 text-purple-600" />
          </div>
          
          <h2 className="text-xl font-semibold text-gray-900 mb-2 text-center">
            Función no disponible
          </h2>
          
          <p className="text-gray-600 text-center max-w-xs leading-relaxed">
            Las notificaciones estarán disponibles en una próxima versión de la aplicación.
          </p>
          
          <button
            onClick={onBack}
            className="mt-8 px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition"
          >
            Volver
          </button>
        </div>

      </div>
    </div>
  );
};

export default NotificationsScreen;
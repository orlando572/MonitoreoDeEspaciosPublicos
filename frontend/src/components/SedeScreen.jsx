import { useState, useEffect } from 'react';
import { Bell, User, Coffee, Headphones, Home, Sun } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../config/api';

const SedeScreen = ({ onSelectLocation, onOpenProfile, onOpenNotifications }) => {
  const { user } = useAuth();
  const [ubicaciones, setUbicaciones] = useState([]);

  useEffect(() => {
    apiClient.get('/ubicaciones')
      .then(res => res.json())
      .then(data => setUbicaciones(data))
      .catch(err => console.error(err));
  }, []);

  const getIcon = (nombre) => {
    if (nombre.toLowerCase().includes('cafetería')) return Coffee;
    if (nombre.toLowerCase().includes('patio') && nombre.toLowerCase().includes('trasero')) return Headphones;
    if (nombre.toLowerCase().includes('patio') && nombre.toLowerCase().includes('central')) return Home;
    if (nombre.toLowerCase().includes('patio')) return Headphones;
    if (nombre.toLowerCase().includes('azotea')) return Sun;
    return Home;
  };

  const parra = ubicaciones.filter(u => u.sede === 'Parra');
  const tacna = ubicaciones.filter(u => u.sede === 'Tacna');

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-sm h-screen bg-white shadow-2xl flex flex-col">

        <div className="bg-gradient-to-r from-purple-600 to-purple-500 px-6 py-6">
          <div className="flex justify-between items-center mb-4">

            <div className="flex items-center gap-2">

              <button 
                onClick={onOpenProfile} 
                className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-300 transition"
              >
                <User className="w-5 h-5 text-purple-600" />
              </button>

              <button 
                onClick={onOpenProfile}
                className="text-white text-lg font-medium hover:text-gray-300 transition"
              >
                Hola, {user?.nombre?.split(' ')[0]}
              </button>

            </div>

            <button 
              onClick={onOpenNotifications}
              className="p-2 rounded-full hover:bg-white/20 transition"
            >
              <Bell className="w-6 h-6 text-white" />
            </button>

          </div>

          <h1 className="text-white text-2xl font-bold">Sede</h1>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-2">

            <div className="border-r border-gray-300">
              <div className="py-4 text-center font-medium text-gray-900 border-b border-gray-300 text-2xl">
                Parra
              </div>
              <div className="px-3 py-6 space-y-4">
                {parra.map(ubicacion => {
                  const Icon = getIcon(ubicacion.nombre);
                  return (
                    <button
                      key={ubicacion.id}
                      onClick={() => onSelectLocation(ubicacion)}
                      className="w-full flex flex-col items-center"
                    >
                      <div className="w-32 aspect-square bg-purple-100 rounded-2xl flex items-center justify-center mb-2 hover:bg-purple-200 transition-colors">
                        <Icon className="w-17 h-17 text-gray-800" strokeWidth={1.5} />
                      </div>
                      <span className="text-sm text-gray-800 text-center text-xl">{ubicacion.nombre}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="py-4 text-center font-medium text-gray-900 border-b border-gray-300 text-2xl">
                Tacna
              </div>
              <div className="px-3 py-6 space-y-4">
                {tacna.map(ubicacion => {
                  const Icon = getIcon(ubicacion.nombre);
                  return (
                    <button
                      key={ubicacion.id}
                      onClick={() => onSelectLocation(ubicacion)}
                      className="w-full flex flex-col items-center"
                    >
                      <div className="w-32 aspect-square bg-purple-100 rounded-2xl flex items-center justify-center mb-2 hover:bg-purple-200 transition-colors">
                        <Icon className="w-17 h-17 text-gray-800" strokeWidth={1.5} />
                      </div>
                      <span className="text-sm text-gray-800 text-center text-xl">{ubicacion.nombre}</span>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default SedeScreen;
import React, { useState, useEffect } from 'react';
import { Bell, User, Coffee, Headphones, Home, Sun } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../config/api';

const SedeScreen = ({ onSelectLocation, onOpenProfile }) => {
  const { user } = useAuth();
  const [ubicaciones, setUbicaciones] = useState([]);

  useEffect(() => {
    apiClient.get('/ubicaciones')
      .then(res => res.json())
      .then(data => setUbicaciones(data))
      .catch(err => console.error(err));
  }, []);

  const getIcon = (nombre) => {
    if (nombre.toLowerCase().includes('cafeteria')) return Coffee;
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
        <div className="flex justify-between items-center px-6 py-2 bg-white">
          <span className="text-sm font-medium">9:30</span>
        </div>

        <div className="bg-gradient-to-r from-purple-600 to-purple-500 px-6 py-6 rounded-b-3xl">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <button onClick={onOpenProfile} className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-purple-600" />
              </button>
              <span className="text-white text-lg font-medium">Hola, {user?.nombre?.split(' ')[0]}</span>
            </div>
            <Bell className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-white text-3xl font-bold">Sede</h1>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-2">
            <div className="border-r border-gray-200">
              <div className="py-4 text-center font-medium text-gray-900 border-b border-gray-200">
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
                      <div className="w-full aspect-square bg-purple-100 rounded-3xl flex items-center justify-center mb-3 hover:bg-purple-200 transition-colors">
                        <Icon className="w-10 h-10 text-gray-800" strokeWidth={1.5} />
                      </div>
                      <span className="text-sm text-gray-800 text-center">{ubicacion.nombre}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="py-4 text-center font-medium text-gray-900 border-b border-gray-200">
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
                      <div className="w-full aspect-square bg-purple-100 rounded-3xl flex items-center justify-center mb-3 hover:bg-purple-200 transition-colors">
                        <Icon className="w-10 h-10 text-gray-800" strokeWidth={1.5} />
                      </div>
                      <span className="text-sm text-gray-800 text-center">{ubicacion.nombre}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center py-2 pb-4">
          <div className="w-32 h-1 bg-gray-800 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default SedeScreen;
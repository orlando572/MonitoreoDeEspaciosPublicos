import { useState, useEffect } from 'react';
import { Bell, User, ArrowLeft, Coffee, Headphones, Home, Sun, Clock, Users, Table, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../config/api';
import LoadingScreen from './LoadingScreen';

const LocationDetailScreen = ({ ubicacion, onBack }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    setLoading(true);
    apiClient.get(`/captura/ultima/${ubicacion.id}`)
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [ubicacion.id]);

  const getIcon = (nombre) => {
    if (nombre.toLowerCase().includes('cafeteria')) return Coffee;
    if (nombre.toLowerCase().includes('patio') && nombre.toLowerCase().includes('trasero')) return Headphones;
    if (nombre.toLowerCase().includes('patio')) return Headphones;
    if (nombre.toLowerCase().includes('azotea')) return Sun;
    return Home;
  };

  const Icon = getIcon(ubicacion.nombre);

  if (loading) {
    return <LoadingScreen />;
  }

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-sm h-screen bg-white shadow-2xl flex flex-col">
        <div className="flex justify-between items-center px-6 py-2 bg-white">
          <span className="text-sm font-medium">9:30</span>
        </div>

        <div className="bg-gradient-to-r from-purple-600 to-purple-500 px-6 py-6 rounded-b-3xl">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <button onClick={onBack}>
                <ArrowLeft className="w-6 h-6 text-white" />
              </button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-purple-600" />
                </div>
                <span className="text-white text-base font-medium">Hola, {user?.nombre?.split(' ')[0]}</span>
              </div>
            </div>
            <Bell className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-white text-2xl font-bold">Uso del espacio</h1>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold text-gray-900">{ubicacion.nombre}</h2>
              <Icon className="w-5 h-5 text-gray-700" />
            </div>
            <span className="text-base text-gray-700">{ubicacion.sede}</span>
          </div>

          <p className="text-sm text-gray-600 mb-4">Mapa de calor</p>

          {!data?.id ? (
            <div className="mb-6 p-8 bg-gray-50 rounded-2xl border-2 border-gray-200 text-center">
              <p className="text-gray-600">No hay datos disponibles para esta ubicación</p>
            </div>
          ) : (
            <>
              <div className="mb-6 rounded-2xl overflow-hidden border-2 border-gray-200">
                <div className="w-full h-48 bg-gradient-to-br from-red-200 via-yellow-200 to-blue-200 flex items-center justify-center">
                  <span className="text-gray-700 font-medium">Mapa de calor simulado</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-gray-700" />
                  <span className="text-gray-700 text-base">Actualizado:</span>
                  <span className="text-gray-900 text-base ml-auto">
                    {formatTime(data.fecha_hora)}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-gray-700" />
                  <span className="text-gray-700 text-base">Personas:</span>
                  <span className="text-gray-900 text-base ml-auto">{data.total_personas}</span>
                </div>

                <div className="flex items-center gap-3">
                  <Table className="w-5 h-5 text-gray-700" />
                  <span className="text-gray-700 text-base">Mesas libres:</span>
                  <span className="text-gray-900 text-base ml-auto">{data.total_mesas_libres}</span>
                </div>

                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-gray-700" />
                  <span className="text-gray-700 text-base">Enchufes disp:</span>
                  <span className="text-gray-900 text-base ml-auto">N/A</span>
                </div>
              </div>

              <div className="mt-8 flex justify-center">
                <button className="bg-purple-100 text-purple-900 px-8 py-4 rounded-full flex items-center gap-2 font-medium hover:bg-purple-200 transition-colors">
                  <Bell className="w-5 h-5" />
                  Notificarme
                </button>
              </div>
            </>
          )}
        </div>

        <div className="flex justify-center py-2 pb-4">
          <div className="w-32 h-1 bg-gray-800 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default LocationDetailScreen;
import { useState } from 'react';
import { X, Phone, Mail, Edit2, Send } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../config/api';

const ProfileScreen = ({ onClose }) => {
  const { user, logout } = useAuth();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    nombre: user?.nombre || '',
    email: user?.email || '',
    celular: user?.celular || ''
  });
  const [feedback, setFeedback] = useState('');

  const handleUpdate = async () => {
    try {
      const response = await apiClient.put(`/usuario/${user.id}`, formData);

      if (response.ok) {
        alert('Perfil actualizado');
        setEditing(false);
      }
    } catch (err) {
      alert('Error al actualizar');
    }
  };

  const handleSendFeedback = async () => {
    if (!feedback.trim()) return;

    try {
      const response = await apiClient.post(`/feedback/${user.id}`, { mensaje: feedback });

      if (response.ok) {
        alert('Feedback enviado. ¡Gracias!');
        setFeedback('');
      }
    } catch (err) {
      alert('Error al enviar feedback');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-sm h-screen bg-white shadow-2xl flex flex-col">
        <div className="flex justify-between items-center px-6 py-2 bg-white">
          <span className="text-sm font-medium">9:30</span>
        </div>

        <div className="flex justify-end px-6 pt-4">
          <button onClick={onClose} className="text-purple-600">
            <X className="w-7 h-7" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-6">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-20 h-20 rounded-full border-2 border-gray-300 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-12 h-12" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="8" r="4" />
                <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900">{user?.nombre}</h2>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-medium text-gray-900">Mis datos personales</h3>
              <button 
                onClick={() => editing ? handleUpdate() : setEditing(true)}
                className="flex items-center gap-1 text-purple-600"
              >
                <Edit2 className="w-4 h-4" />
                <span className="text-sm font-medium">{editing ? 'Guardar' : 'Editar'}</span>
              </button>
            </div>

            {editing ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="Nombre"
                />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="Email"
                />
                <input
                  type="tel"
                  value={formData.celular}
                  onChange={(e) => setFormData({...formData, celular: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="Celular"
                />
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-700">
                  <Phone className="w-5 h-5" />
                  <span className="text-base">{user?.celular || 'No especificado'}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Mail className="w-5 h-5" />
                  <span className="text-base">{user?.email}</span>
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 my-6"></div>

          <div className="mb-6">
            <h3 className="text-base font-medium text-gray-900 mb-3">Ayúdanos a seguir mejorando</h3>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Escribe aquí tu sugerencia"
              className="w-full h-24 px-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-700 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
            ></textarea>
          </div>

          <div className="border-t border-gray-200 my-6"></div>

          <button 
            onClick={handleSendFeedback}
            className="w-full bg-purple-100 text-purple-700 py-4 rounded-lg flex items-center justify-center gap-2 font-medium mb-4"
          >
            <Send className="w-5 h-5" />
            Enviar
          </button>

          <button 
            onClick={logout}
            className="w-full bg-white border-2 border-gray-900 text-gray-900 py-4 rounded-lg font-medium"
          >
            Cerrar sesión
          </button>
        </div>

        <div className="flex justify-center py-2 pb-4">
          <div className="w-32 h-1 bg-gray-800 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;
import { useState } from 'react';
import { X, Phone, Mail, Edit2, Send } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../config/api';
import NotificationModal from './NotificationModal';

const ProfileScreen = ({ onClose }) => {
  const { user, logout } = useAuth();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    nombre: user?.nombre || '',
    email: user?.email || '',
    celular: user?.celular || ''
  });
  const [feedback, setFeedback] = useState('');

  const [modal, setModal] = useState({
    isOpen: false,
    type: 'success',
    title: '',
    message: ''
  });

  const showModal = (type, title, message) => {
    setModal({ isOpen: true, type, title, message });
  };

  const handleUpdate = async () => {
    try {
      const response = await apiClient.put(`/usuario/${user.id}`, formData);

      if (response.ok) {
        showModal('success', 'PERFIL ACTUALIZADO', 'Tus datos se han guardado correctamente.');
        setEditing(false);
      } else {
        showModal('error', 'ERROR', 'No se pudo actualizar el perfil.');
      }
    } catch (err) {
      showModal('error', 'ERROR DE CONEXIÓN', 'Ocurrió un error al intentar actualizar.');
    }
  };

  const handleSendFeedback = async () => {
    if (!feedback.trim()) return;

    try {
      const response = await apiClient.post(`/feedback/${user.id}`, { mensaje: feedback });

      if (response.ok) {
        showModal('success', 'FEEDBACK ENVIADO', '¡Gracias por tus comentarios! Nos ayudan a mejorar.');
        setFeedback('');
      } else {
        showModal('error', 'ERROR', 'No se pudo enviar el feedback.');
      }
    } catch (err) {
      showModal('error', 'ERROR', 'Error de conexión al enviar feedback.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">

      {/* Modal */}
      <NotificationModal
        isOpen={modal.isOpen}
        onClose={() => setModal({ ...modal, isOpen: false })}
        type={modal.type}
        title={modal.title}
        message={modal.message}
      />

      <div className="w-full max-w-sm h-screen bg-white shadow-2xl flex flex-col">

        {/* Cerrar */}
        <div className="flex justify-end px-6 pt-4">
          <button 
            onClick={onClose} 
            className="text-purple-600 hover:text-purple-800 transition"
          >
            <X className="w-7 h-7" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-6">
          
          {/* Perfil */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-25 h-25 rounded-full border-2 border-gray-500 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-12 h-12" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="8" r="4" />
                <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900">{user?.nombre}</h2>
          </div>

          {/* Datos personales */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Mis datos personales</h3>

              <button 
                onClick={() => editing ? handleUpdate() : setEditing(true)}
                className="flex items-center gap-1 text-purple-600 hover:text-purple-800 transition"
              >
                <Edit2 className="w-4 h-4" />
                <span className="text-md font-medium">
                  {editing ? 'Guardar' : 'Editar'}
                </span>
              </button>
            </div>

            {editing ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="Nombre"
                />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="Email"
                />
                <input
                  type="tel"
                  value={formData.celular}
                  onChange={(e) => setFormData({ ...formData, celular: e.target.value })}
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

          <div className="border-t border-gray-400 my-6"></div>

          {/* Feedback */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">
              Ayúdanos a seguir mejorando
            </h3>

            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Escribe aquí tu sugerencia"
              className="w-full h-24 px-4 py-3 border border-gray-400 rounded-lg text-md text-gray-700 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
            ></textarea>
          </div>

          <div className="border-t border-gray-400 my-6"></div>

          {/* Enviar feedback */}
          <button 
            onClick={handleSendFeedback}
            className="w-full bg-purple-100 hover:bg-purple-200 text-purple-700 py-4 rounded-lg flex items-center justify-center gap-2 font-medium mb-4 transition"
          >
            <Send className="w-5 h-5" />
            Enviar
          </button>

          {/* Cerrar sesión */}
          <button 
            onClick={logout}
            className="text-lg w-full bg-white border-2 border-gray-400 hover:bg-gray-200 hover:border-gray-700 text-gray-900 py-4 rounded-lg font-medium transition"
          >
            Cerrar sesión
          </button>

        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;

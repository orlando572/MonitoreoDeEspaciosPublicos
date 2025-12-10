import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { apiClient } from '../config/api';
import NotificationModal from './NotificationModal';

const RegisterScreen = ({ onBack }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    celular: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Estado del modal
  const [modal, setModal] = useState({
    isOpen: false,
    type: 'success',
    title: '',
    message: ''
  });

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await apiClient.post('/registro', formData);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Error al registrarse');
      }

      // Mostrar modal exitoso
      setModal({
        isOpen: true,
        type: 'success',
        title: 'REGISTRO EXITOSO',
        message: 'Tu cuenta ha sido creada correctamente. Ya puedes iniciar sesión.'
      });

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setModal({ ...modal, isOpen: false });

    if (modal.type === 'success') {
      onBack();
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">

      {/* Modal */}
      <NotificationModal
        isOpen={modal.isOpen}
        onClose={handleCloseModal}
        type={modal.type}
        title={modal.title}
        message={modal.message}
      />

      <div className="w-full max-w-sm h-screen bg-white shadow-2xl flex flex-col">

        <div className="flex items-center px-6 pt-4">
          <button onClick={onBack}>
            <ArrowLeft className="w-6 h-6 text-gray-900" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900 ml-4">Registro</h1>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">

          <form onSubmit={handleRegister} className="space-y-4">

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre completo
              </label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) =>
                  setFormData({ ...formData, nombre: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Celular (opcional)
              </label>
              <input
                type="tel"
                value={formData.celular}
                onChange={(e) =>
                  setFormData({ ...formData, celular: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 text-white py-4 rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50"
            >
              {loading ? 'Registrando...' : 'Crear cuenta'}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};

export default RegisterScreen;

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../config/api';

const LoginScreen = ({ onRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await apiClient.post('/login', { email, password });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Error al iniciar sesión');
      }

      login(data.usuario);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-sm h-screen bg-white shadow-2xl flex flex-col">
        <div className="flex justify-between items-center px-6 py-2 bg-white">
          <span className="text-sm font-medium">9:30</span>
        </div>

        <div className="flex-1 flex flex-col justify-center px-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Bienvenido</h1>
            <p className="text-gray-600">Sistema de Monitoreo UNSA</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="tu@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 text-white py-4 rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50"
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>
          </form>

          <button
            onClick={onRegister}
            className="w-full mt-4 text-purple-600 font-medium"
          >
            ¿No tienes cuenta? Regístrate
          </button>
        </div>

        <div className="flex justify-center py-2 pb-4">
          <div className="w-32 h-1 bg-gray-800 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
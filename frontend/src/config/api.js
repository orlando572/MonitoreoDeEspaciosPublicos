// Configuración de la API
export const API_URL = 'http://localhost:8000/api';

// Funciones helper para las llamadas a la API
export const apiClient = {
  async post(endpoint, data) {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response;
  },

  async get(endpoint) {
    const response = await fetch(`${API_URL}${endpoint}`);
    return response;
  },

  async put(endpoint, data) {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response;
  }
};
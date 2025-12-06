import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginScreen from './components/LoginScreen';
import RegisterScreen from './components/RegisterScreen';
import ProfileScreen from './components/ProfileScreen';
import SedeScreen from './components/SedeScreen';
import LocationDetailScreen from './components/LocationDetailScreen';

function AppContent({ screen, setScreen, selectedLocation, setSelectedLocation }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-gray-600">Cargando...</div>
      </div>
    );
  }

  if (!user) {
    if (screen === 'register') {
      return <RegisterScreen onBack={() => setScreen('login')} />;
    }
    return <LoginScreen onRegister={() => setScreen('register')} />;
  }

  if (screen === 'profile') {
    return <ProfileScreen onClose={() => setScreen('sede')} />;
  }

  if (screen === 'location' && selectedLocation) {
    return (
      <LocationDetailScreen 
        ubicacion={selectedLocation}
        onBack={() => {
          setSelectedLocation(null);
          setScreen('sede');
        }}
      />
    );
  }

  return (
    <SedeScreen 
      onSelectLocation={(ubicacion) => {
        setSelectedLocation(ubicacion);
        setScreen('location');
      }}
      onOpenProfile={() => setScreen('profile')}
    />
  );
}

export default function App() {
  const [screen, setScreen] = useState('login');
  const [selectedLocation, setSelectedLocation] = useState(null);

  return (
    <AuthProvider>
      <AppContent 
        screen={screen} 
        setScreen={setScreen}
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
      />
    </AuthProvider>
  );
}
import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginScreen from './components/LoginScreen';
import RegisterScreen from './components/RegisterScreen';
import ProfileScreen from './components/ProfileScreen';
import SedeScreen from './components/SedeScreen';
import LocationDetailScreen from './components/LocationDetailScreen';
import NotificationsScreen from './components/NotificationsScreen';

function AppContent({ screen, setScreen, selectedLocation, setSelectedLocation, previousScreen, setPreviousScreen }) {
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
    return (
      <ProfileScreen 
        onClose={() => setScreen(previousScreen || 'sede')}
      />
    );
  }

  if (screen === 'notifications') {
    return (
      <NotificationsScreen 
        onBack={() => setScreen(previousScreen || 'sede')}
      />
    );
  }

  if (screen === 'location' && selectedLocation) {
    return (
      <LocationDetailScreen 
        ubicacion={selectedLocation}
        onBack={() => {
          setSelectedLocation(null);
          setScreen('sede');
        }}
        onOpenNotifications={() => {
          setPreviousScreen('location');
          setScreen('notifications');
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
      onOpenProfile={() => {
        setPreviousScreen('sede');
        setScreen('profile');
      }}
      onOpenNotifications={() => {
        setPreviousScreen('sede');
        setScreen('notifications');
      }}
    />
  );
}

export default function App() {
  const [screen, setScreen] = useState('login');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [previousScreen, setPreviousScreen] = useState('sede');

  return (
    <AuthProvider>
      <AppContent 
        screen={screen} 
        setScreen={setScreen}
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
        previousScreen={previousScreen}
        setPreviousScreen={setPreviousScreen}
      />
    </AuthProvider>
  );
}
const LoadingScreen = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-sm h-screen bg-white shadow-2xl flex flex-col">

        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="relative w-32 h-32 mb-6">
            <svg className="w-full h-full animate-spin" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="8" />
              <circle
                cx="50" cy="50" r="40" fill="none" stroke="#7c3aed" strokeWidth="8"
                strokeLinecap="round" strokeDasharray="188.5" strokeDashoffset="47"
                transform="rotate(-90 50 50)"
              />
            </svg>
          </div>
          <p className="text-gray-400 text-base">Cargando mapa de calor ...</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
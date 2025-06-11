const Home = () => {
  return (
    <div className="pattern-bg bg-cover bg-center min-h-[calc(100vh-4rem)] flex items-center justify-center">
      <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-blue-50 to-white w-full py-16 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-6xl font-extrabold text-blue-700 mb-6 drop-shadow-sm">
            Bienvenido a <span className="text-blue-900">Conectados</span>
          </h1>
          <p className="text-xl text-gray-700 mb-12 max-w-2xl mx-auto">
            Encuentra profesionales confiables para servicios como Belleza,
            Gasfiteria, Jardineria, Limpieza y mucho más.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
            {/* Card 1 */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border hover:shadow-2xl transition duration-300">
              <div className="w-14 h-14 flex items-center justify-center bg-blue-100 text-blue-600 text-3xl rounded-full mb-4 mx-auto">
                🔍
              </div>
              <h3 className="text-xl font-bold text-blue-700 mb-2">
                Buscar Servicios
              </h3>
              <p className="text-gray-600 text-sm">
                Usa filtros por ubicación, tipo de servicio y disponibilidad
                para encontrar lo que necesitas.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border hover:shadow-2xl transition duration-300">
              <div className="w-14 h-14 flex items-center justify-center bg-blue-100 text-blue-600 text-3xl rounded-full mb-4 mx-auto">
                📅
              </div>
              <h3 className="text-xl font-bold text-blue-700 mb-2">
                Agenda Online
              </h3>
              <p className="text-gray-600 text-sm">
                Consulta la disponibilidad de los profesionales y agenda con un
                solo clic.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border hover:shadow-2xl transition duration-300">
              <div className="w-14 h-14 flex items-center justify-center bg-blue-100 text-blue-600 text-3xl rounded-full mb-4 mx-auto">
                💬
              </div>
              <h3 className="text-xl font-bold text-blue-700 mb-2">
                Reseñas Reales
              </h3>
              <p className="text-gray-600 text-sm">
                Conoce las opiniones de otros usuarios antes de contratar un
                servicio.
              </p>
            </div>
          </div>

          <div className="mt-16">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-full text-lg font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition duration-300"
              onClick={() => (window.location.href = '/servicios')} // podria tambien llevar a login si es que pensamos que hay que estar logeado para ver los servicios
            >
              Ver Servicios Disponibles
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home

const Home = () => {
  return (
    <div className="pattern-bg bg-cover bg-center min-h-screen flex items-center justify-center">
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-12 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl font-extrabold text-blue-700 mb-4">
            Bienvenido a Conectados
          </h1>
          <p className="text-lg text-gray-700 mb-10">
            Encuentra profesionales confiables para servicios como peluquería,
            electricidad, jardinería y más.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white rounded-2xl shadow-md p-6 border hover:shadow-xl transition">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-blue-600 mb-2">
                Buscar Servicios
              </h3>
              <p className="text-gray-600 text-sm">
                Usa filtros por ubicación, tipo de servicio y disponibilidad
                para encontrar lo que necesitas.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-2xl shadow-md p-6 border hover:shadow-xl transition">
              <div className="text-4xl mb-4">📅</div>
              <h3 className="text-xl font-semibold text-blue-600 mb-2">
                Agenda Online
              </h3>
              <p className="text-gray-600 text-sm">
                Consulta la disponibilidad de los profesionales y agenda con un
                solo clic.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-2xl shadow-md p-6 border hover:shadow-xl transition">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-xl font-semibold text-blue-600 mb-2">
                Reseñas Reales
              </h3>
              <p className="text-gray-600 text-sm">
                Conoce las opiniones de otros usuarios antes de contratar un
                servicio.
              </p>
            </div>
          </div>

          <div className="mt-12">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full text-lg transition font-semibold">
              Empezar ahora
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home

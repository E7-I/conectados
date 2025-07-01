import { useAuth } from '../contexts/AuthContext'

const Home = () => {
  const { isLoggedIn } = useAuth()

  return (
    <div className="pattern-bg bg-cover bg-center min-h-[calc(100vh-4rem)] p-4">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="bg-white rounded-lg shadow-lg mb-6 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-blue-700 px-6 py-12">
            <div className="text-center">
              <h1 className="text-white text-4xl md:text-6xl font-extrabold mb-4">
                Bienvenido a <span className="text-blue-100">Conectados</span>
              </h1>
              <p className="text-blue-100 text-lg md:text-xl mb-8 max-w-3xl mx-auto">
                Conecta con profesionales confiables para todos tus servicios. 
                Desde belleza y gasfitería hasta jardinería y limpieza, encuentra 
                expertos cerca de ti.
              </p>
              <button
                className="bg-white hover:bg-blue-50 text-blue-700 px-8 py-3 rounded-md text-lg font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                onClick={() => (window.location.href = '/servicios')}
              >
                Explorar Servicios
              </button>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-green-500 to-green-700 px-6 py-4">
            <h2 className="text-white text-2xl font-bold text-center">
              ¿Cómo Funciona?
            </h2>
            <p className="text-green-100 mt-1 text-center">
              Conectarse con profesionales nunca fue tan fácil
            </p>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="text-center group hover:transform hover:scale-105 transition-all duration-300">
                <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:shadow-lg transition-shadow duration-300">
                  <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Buscar Servicios
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Utiliza nuestros filtros avanzados por ubicación, categoría, precio y 
                  calificaciones para encontrar exactamente lo que necesitas.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="text-center group hover:transform hover:scale-105 transition-all duration-300">
                <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:shadow-lg transition-shadow duration-300">
                  <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-2 8h2m-2 4h2M8 21l4-4 4 4M3 4h18M4 8h16l-1 8H5L4 8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Agenda en Línea
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Consulta la disponibilidad en tiempo real y agenda tu cita 
                  directamente con el profesional de manera instantánea.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="text-center group hover:transform hover:scale-105 transition-all duration-300">
                <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:shadow-lg transition-shadow duration-300">
                  <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Reseñas Verificadas
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Lee opiniones reales de otros usuarios y toma decisiones 
                  informadas basadas en experiencias auténticas.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Services Categories */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-orange-500 to-orange-700 px-6 py-4">
            <h2 className="text-white text-2xl font-bold text-center">
              Categorías Populares
            </h2>
            <p className="text-orange-100 mt-1 text-center">
              Encuentra profesionales en estas áreas
            </p>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { name: 'Belleza', icon: '💄', color: 'bg-pink-100 text-pink-800' },
                { name: 'Construcción', icon: '🔨', color: 'bg-orange-100 text-orange-800' },
                { name: 'Gasfitería', icon: '🔧', color: 'bg-blue-100 text-blue-800' },
                { name: 'Jardinería', icon: '🌱', color: 'bg-green-100 text-green-800' },
                { name: 'Electricidad', icon: '⚡', color: 'bg-yellow-100 text-yellow-800' },
                { name: 'Gastronomía', icon: '👨‍🍳', color: 'bg-red-100 text-red-800' },
                { name: 'Limpieza', icon: '🧹', color: 'bg-purple-100 text-purple-800' },
                { name: 'Otros', icon: '🛠️', color: 'bg-gray-100 text-gray-800' }
              ].map((category, index) => (
                <div 
                  key={index}
                  className="bg-gray-50 rounded-lg p-4 text-center hover:shadow-md transition-all duration-200 cursor-pointer hover:transform hover:scale-105"
                  onClick={() => (window.location.href = `/servicios?category=${category.name}`)}
                >
                  <div className="text-3xl mb-2">{category.icon}</div>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${category.color}`}>
                    {category.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-500 to-indigo-700 px-6 py-8">
            <div className="text-center">
              <h2 className="text-white text-3xl font-bold mb-4">
                {isLoggedIn ? '¡Bienvenido de vuelta!' : '¿Listo para comenzar?'}
              </h2>
              <p className="text-indigo-100 text-lg mb-6 max-w-2xl mx-auto">
                {isLoggedIn 
                  ? 'Explora nuestros servicios y encuentra el profesional perfecto para ti'
                  : 'Únete a miles de usuarios que ya encontraron a su profesional ideal'
                }
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  className="bg-white hover:bg-indigo-50 text-indigo-700 px-8 py-3 rounded-md text-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300"
                  onClick={() => (window.location.href = '/servicios')}
                >
                  Ver Servicios
                </button>
                {!isLoggedIn && (
                  <button
                    className="border-2 border-white text-white hover:bg-white hover:text-indigo-700 px-8 py-3 rounded-md text-lg font-semibold transition-all duration-300"
                    onClick={() => (window.location.href = '/registro')}
                  >
                    Registrarse
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home

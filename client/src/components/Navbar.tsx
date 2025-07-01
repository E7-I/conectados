
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useState } from 'react'

const Navbar = () => {
  const { isLoggedIn, user, logout } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)


  // Ocultar navbar en rutas específicas
  /* const hideNavbar = ['/login', '/registro'].includes(location.pathname)

  if (hideNavbar) return null*/

  const handleLogout = () => {
    logout()
    window.location.href = '/'
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <nav className="bg-blue-600 p-4 text-white">
      <div className="flex justify-between items-center h-8">
        <Link to="/" className="font-bold text-xl">
          Conectados
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex space-x-4 items-center">
          <Link to="/" className="hover:text-blue-200 transition-colors">
            Inicio
          </Link>
          <Link
            to="/servicios"
            className="hover:text-blue-200 transition-colors"
          >
            Servicios
          </Link>
          {!isLoggedIn && (
            <Link
              to="/registro"
              className="hover:text-blue-200 transition-colors"
            >
              Registro
            </Link>
          )}
          {!isLoggedIn && (
            <Link to="/login" className="hover:text-blue-200 transition-colors">
              Iniciar Sesión
            </Link>
          )}
          {isLoggedIn && (
            <Link
              to="/prestador/123"
              className="hover:text-blue-200 transition-colors"
            >
              Perfil Profesional
            </Link>
          )}
          {isLoggedIn && (
            <Link
              to="/settings"
              className="hover:text-blue-200 transition-colors"
            >
              Configuración
            </Link>
          )}
          {isLoggedIn && (
            <Link
              to="/reviews"
              className="hover:text-blue-200 transition-colors"
            >
              Mis Reseñas
            </Link>
          )}
          {isLoggedIn && (
            <>
              <span className="text-blue-200">Hola, {user?.nombre?.split(' ')[0]}</span>
              <button
                onClick={handleLogout}
                className="bg-blue-500 hover:bg-blue-400 px-3 py-1 rounded text-sm transition-colors"
              >
                Cerrar Sesión
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="lg:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1"
          aria-label="Toggle mobile menu"
        >
          <span
            className={`block w-6 h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}
          ></span>
          <span
            className={`block w-6 h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}
          ></span>
          <span
            className={`block w-6 h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}
          ></span>
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}
      >
        <div className="pt-4 pb-2 space-y-2">
          <Link
            to="/"
            className="block py-2 px-4 hover:bg-blue-700 rounded transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Inicio
          </Link>
          <Link
            to="/servicios"
            className="block py-2 px-4 hover:bg-blue-700 rounded transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Servicios
          </Link>
          {!isLoggedIn && (
            <>
              <Link
                to="/registro"
                className="block py-2 px-4 hover:bg-blue-700 rounded transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Registro
              </Link>
              <Link
                to="/login"
                className="block py-2 px-4 hover:bg-blue-700 rounded transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Iniciar Sesión
              </Link>
            </>
          )}
          {isLoggedIn && (
            <>
              <Link
                to="/prestador/123"
                className="block py-2 px-4 hover:bg-blue-700 rounded transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Perfil Profesional
              </Link>
              <Link
                to="/settings"
                className="block py-2 px-4 hover:bg-blue-700 rounded transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Configuración
              </Link>
              <Link
                to="/reviews"
                className="block py-2 px-4 hover:bg-blue-700 rounded transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Mis Reseñas
              </Link>
              <div className="px-4 py-2">
                <span className="text-blue-200 text-sm">
                  Hola, {user?.nombre}
                </span>
              </div>
              <button
                onClick={() => {
                  handleLogout()
                  setIsMobileMenuOpen(false)
                }}
                className="block w-full text-left py-2 px-4 bg-blue-500 hover:bg-blue-400 rounded transition-colors"
              >
                Cerrar Sesión
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar

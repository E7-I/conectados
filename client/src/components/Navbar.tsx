import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const Navbar = () => {
  const location = useLocation()
  const { isLoggedIn, user, logout } = useAuth()

  // Ocultar navbar en rutas específicas
  const hideNavbar = ['/login', '/registro'].includes(location.pathname)

  if (hideNavbar) return null

  const handleLogout = () => {
    logout()
    window.location.href = '/'
  }

  return (
    <nav className="bg-blue-600 p-4 text-white flex justify-between h-16 items-center">
      <Link to="/" className="font-bold text-xl">
        Conectados
      </Link>
      <div className="space-x-4 flex items-center">
        <Link to="/">Inicio</Link>
        <Link to="/servicios">Servicios</Link>
        {!isLoggedIn && <Link to="/registro">Registro</Link>}
        {!isLoggedIn && <Link to="/login">Iniciar Sesión</Link>}
        {isLoggedIn && <Link to="/prestador/123">Perfil Profesional</Link>}
        {isLoggedIn && <Link to="/settings">Configuración</Link>}
        {isLoggedIn && (
          <>
            <span className="text-blue-200">Hola, {user?.nombre}</span>
            <button 
              onClick={handleLogout}
              className="bg-blue-500 hover:bg-blue-400 px-3 py-1 rounded text-sm"
            >
              Cerrar Sesión
            </button>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar

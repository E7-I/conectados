import { Link, useLocation } from 'react-router-dom'

const Navbar = () => {

  const location = useLocation();

  // Ocultar navbar en rutas específicas
  const hideNavbar = ['/login', '/register'].includes(location.pathname)

  if (hideNavbar) return null

  return (
    <nav className="bg-blue-600 p-4 text-white flex justify-between h-16 items-center">
      <Link to="/" className="font-bold text-xl">
        Conectados
      </Link>
      <div className="space-x-4">
        <Link to="/">Inicio</Link>
        <Link to="/servicios">Servicios</Link>
      </div>
    </nav>
  )
}

export default Navbar

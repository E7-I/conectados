import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <nav className="bg-blue-600 p-4 text-white flex justify-between">
      <Link to="/" className="font-bold text-xl">
        Conectados
      </Link>
      <div className="space-x-4">
        <Link to="/">Inicio</Link>
        <Link to="/registro">Registro</Link>
        <Link to="/login">Iniciar Sesión</Link>
      </div>
    </nav>
  )
}

export default Navbar

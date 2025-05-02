import { useState } from 'react'

const Login = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    contrasena: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  //falta modificar para que se haga la verificacion con el server
  interface StoredUser {
    nombre: string
    contrasena: string
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const storedUser: StoredUser | null = JSON.parse(
      localStorage.getItem('user') || 'null'
    )
    if (
      storedUser &&
      storedUser.nombre === formData.nombre &&
      storedUser.contrasena === formData.contrasena
    ) {
      alert('Inicio de sesión exitoso')
    } else {
      alert('Nombre o contraseña incorrectos')
    }
  }

  return (
    <div className="pattern-bg bg-cover bg-center min-h-screen flex items-center justify-center">
      <div>
        <h1 className="text-2xl">Inicio de Sesión</h1>
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="mb-4">
            <label htmlFor="nombre" className="block text-sm font-medium">
              Nombre
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="mt-1 block w-full border rounded-md p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="contrasena" className="block text-sm font-medium">
              Contraseña
            </label>
            <input
              type="password"
              id="contrasena"
              name="contrasena"
              value={formData.contrasena}
              onChange={handleChange}
              className="mt-1 block w-full border rounded-md p-2"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Iniciar Sesión
          </button>
        </form>
        <div className="mt-4">
          <p className="text-sm text-gray-600">
            ¿No tienes una cuenta?{' '}
            <a href="/registro" className="text-blue-500 hover:underline">
              Registrarse
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login

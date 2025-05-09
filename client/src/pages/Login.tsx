import { useState } from 'react'
import axios from 'axios'

const Login = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    contrasena: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const response = await axios.post(
        'http://localhost:5000/api/users/login',
        {
          username: formData.nombre,
          password: formData.contrasena
        },
        { withCredentials: true }
      )
      if (response.status === 200) {
        alert('Inicio de sesión exitoso')
      } else {
        alert('Error en el inicio de sesión')
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert(
          `${error.response?.data?.message || 'Error en el inicio de sesión'}`
        )
      } else {
        console.error('Unexpected error:', error)
        alert('Ocurrió un error inesperado')
      }
    }
  }

  return (
    <div className="pattern-bg bg-cover bg-center flex items-center justify-center">
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

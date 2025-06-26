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
        'https://conectadose7-b5dfgdb2e2fkg2hd.canadacentral-01.azurewebsites.net/api/users/login',
        {
          username: formData.nombre,
          password: formData.contrasena
        },
        { withCredentials: true }
      )
      const { token } = response.data.user
      console.log('Token:', token)
      if (token) {
        localStorage.setItem('authToken', token)
        window.location.href = '/'
      } else {
        console.error('No token received')
      }
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
    <div className="pattern-bg bg-cover bg-center min-h-dvh flex items-center justify-center p-4">
      <div className="flex flex-col md:flex-row w-full max-w-4xl rounded-lg shadow-lg overflow-hidden bg-white">
        {/* Panel Izquierdo */}
        <div className="w-full md:w-1/2 bg-linear-to-b from-blue-500 to-blue-700 flex items-center justify-center p-6 md:p-8">
          <h2 className="text-white text-2xl font-bold text-center">
            CONECTADOS
          </h2>
        </div>

        {/* Panel Derecho - Formulario */}
        <div className="w-full md:w-1/2 p-6 md:p-8">
          <h1 className="text-xl font-bold text-center mb-6">
            Inicio de Sesión
          </h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="nombre" className="block text-sm font-medium">
                Nombre de usuario
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="mt-1 block w-full border rounded-md p-2 border-gray-300"
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
                className="mt-1 block w-full border rounded-md p-2 border-gray-300"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md w-full cursor-pointer hover:bg-blue-700 transition duration-200"
            >
              Iniciar sesión
            </button>
            <p className="text-sm text-center text-gray-600 mt-4">
              ¿No tienes una cuenta?{' '}
              <a
                href="/registro"
                className="text-blue-500 hover:underline font-medium"
              >
                Regístrate
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login

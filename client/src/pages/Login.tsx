import { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useAuth } from '../contexts/AuthContext'

const Login = () => {
  const { login } = useAuth()
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
    console.log('Starting login process...')
    console.log('Form data:', formData)
    
    try {
      console.log('Sending request to server...')
      const response = await axios.post(
        'http://localhost:5000/api/users/login',
        {
          username: formData.nombre,
          password: formData.contrasena
        },
        { 
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
      
      console.log('Server response:', response)
      
      if (response.status === 200) {
        const userData = response.data.user
        const { token } = userData
        console.log('Login response:', response.data)
        console.log('Token:', token)
        console.log('User data:', userData)
        
        if (token && userData) {
          localStorage.setItem('authToken', token)
          // Use the login function from AuthContext
          login({
            _id: userData.id?.toString() || userData._id || '1',
            role: userData.role || 'client',
            nombre: userData.name || userData.username || formData.nombre
          })
          toast.success('Inicio de sesión exitoso')
          setTimeout(() => {
            window.location.href = '/'
          }, 1000)
        } else {
          console.error('No token or user data received')
          console.error('Token:', token)
          console.error('User data:', userData)
          toast.error('Error en el inicio de sesión - No se recibió token')
        }
      } else {
        console.error('Non-200 status:', response.status)
        toast.error('Error en el inicio de sesión')
      }
    } catch (error) {
      console.error('Login error:', error)
      if (axios.isAxiosError(error)) {
        console.error('Axios error details:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          message: error.message
        })
        toast.error(
          `${error.response?.data?.message || error.message || 'Error en el inicio de sesión'}`
        )
      } else {
        console.error('Unexpected error:', error)
        toast.error('Ocurrió un error inesperado')
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
            
            {/* Demo login button for testing */}
            <button
              type="button"
              onClick={() => {
                login({
                  _id: '1',
                  role: 'client',
                  nombre: 'Usuario Demo'
                })
                toast.success('Sesión iniciada como usuario demo')
                window.location.href = '/'
              }}
              className="bg-green-600 text-white px-4 py-2 rounded-md w-full cursor-pointer hover:bg-green-700 transition duration-200 mt-2"
            >
              Iniciar sesión como demo
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

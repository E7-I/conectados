import axios from 'axios'
import { useState } from 'react'

const Register = () => {
  const validaRut = (rutCompleto: string) => {
    if (!/^\d+-[\dkK]$/.test(rutCompleto)) return false

    const [rut, digv] = rutCompleto.split('-')
    const dv = calcularDV(rut)
    return dv === digv.toLowerCase()
  }

  const calcularDV = (rut: string) => {
    let suma = 0
    let multiplo = 2

    for (let i = rut.length - 1; i >= 0; i--) {
      suma += parseInt(rut[i]) * multiplo
      multiplo = multiplo === 7 ? 2 : multiplo + 1
    }

    const resto = 11 - (suma % 11)
    if (resto === 11) return '0'
    if (resto === 10) return 'k'
    return resto.toString()
  }

  const [rutError, setRutError] = useState(false)

  const [formData, setFormData] = useState({
    rut: '',
    username: '',
    nombre: '',
    contrasena: '',
    confirmarContrasena: '',
    email: '',
    role: '',
    location: '',
    timestamp: new Date().toISOString()
  })

  interface ChangeEvent {
    target: {
      name: string
      value: string
    }
  }

  const handleChange = (e: ChangeEvent) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  interface SubmitEvent {
    preventDefault: () => void
  }

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault()
    if (formData.contrasena !== formData.confirmarContrasena) {
      alert('Las contraseñas no coinciden')
      return
    }

    const parseData = {
      ...formData,
      id: formData.rut,
      name: formData.nombre,
      password: formData.contrasena
    }

    try {
      const response = await axios.post(
        'http://localhost:5000/api/users/register',
        parseData
      )
      if (response.status === 201) {
        alert('Registro exitoso')
        console.log('Registro exitoso:', response.data)
      } else {
        alert('Error en el registro')
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert(`${error.response?.data?.message || 'Error en el registro'}`)
      } else {
        console.error('Unexpected error:', error)
        alert('Ocurrió un error inesperado')
      }
    }
  }

  return (
    <div className="pattern-bg bg-cover bg-center min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <div className="flex flex-col md:flex-row w-full max-w-4xl rounded-lg shadow-lg overflow-hidden bg-white">
        {/* Panel Izquierdo */}
        <div className="w-full md:w-1/2 bg-blue-600 flex items-center justify-center p-6 md:p-8">
          <h2 className="text-white text-2xl font-bold text-center">
            CONECTADOS
          </h2>
        </div>

        {/* Panel Derecho - Formulario */}
        <div className="w-full md:w-1/2 p-6 md:p-8">
          <h1 className="text-xl font-bold text-center mb-6">
            Registro
          </h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="rut" className="block text-sm font-medium">
                RUT
              </label>
              <input
                type="text"
                id="rut"
                name="rut"
                placeholder="Ej: 12345678-X"
                value={formData.rut}
                required
                onChange={(e) => {
                  handleChange(e)
                  setRutError(false)
                }}
                onBlur={() => {
                  const cleaned = formData.rut
                    .replace(/[^0-9kK-]/g, '')
                    .replace(/-{2,}/g, '-')
                  setFormData((prev) => ({ ...prev, rut: cleaned }))
                  const isValid = validaRut(cleaned)
                  setRutError(!isValid)
                }}
                className={`mt-1 block w-full border rounded-md p-2 ${
                  rutError ? 'border-red-500' : 'border-gray-300'
                }`}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="username" className="block text-sm font-medium">
                Nombre de usuario
              </label>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Ej: juanperez123"
                value={formData.username}
                onChange={handleChange}
                className="mt-1 block w-full border rounded-md p-2 border-gray-300"
                required
                minLength={3}
                maxLength={30}
              />
              <p className="text-xs text-gray-500 mt-1">
                Este será tu nombre de usuario para iniciar sesión
              </p>
            </div>
            <div className="mb-4">
              <label htmlFor="nombre" className="block text-sm font-medium">
                Nombre real
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                placeholder="Ej: Juan Pérez"
                value={formData.nombre}
                onChange={handleChange}
                className="mt-1 block w-full border rounded-md p-2 border-gray-300"
                required
                minLength={1}
                maxLength={50}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium">
                Correo electrónico
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
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
                minLength={6}
                maxLength={20}
                pattern={`^(?!.*${formData.username}).{6,20}$`}
                title="La contraseña no puede contener el nombre de usuario"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="confirmarContrasena"
                className="block text-sm font-medium"
              >
                Confirmar contraseña
              </label>
              <input
                type="password"
                id="confirmarContrasena"
                name="confirmarContrasena"
                value={formData.confirmarContrasena}
                onChange={handleChange}
                className="mt-1 block w-full border rounded-md p-2 border-gray-300"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md w-full cursor-pointer hover:bg-blue-600 transition duration-200"
              onClick={() => console.log(formData)}
            >
              Registrarse
            </button>
            <p className="text-sm text-center text-gray-600 mt-4">
              ¿Ya tienes una cuenta?{' '}
              <a href="/login" className="text-blue-500 hover:underline font-medium">
                Inicia sesión
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Register

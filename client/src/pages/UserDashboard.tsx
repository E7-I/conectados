import { useState, useEffect } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

interface User {
  id: string
  username: string
  name: string
  email: string
  role: string
  banned: boolean
  createdAt: string
}

const AdminDashboard = () => {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>('')
  const [updatingUser, setUpdatingUser] = useState<string | null>(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // simulación de datos de usuarios @_@
        const mockUsers: User[] = [
          {
            id: '1',
            username: 'juanperez',
            name: 'Juan Pérez',
            email: 'juan@example.com',
            role: 'client',
            banned: false,
            createdAt: '2024-01-15T10:30:00Z'
          },
          {
            id: '2',
            username: 'mariagomez',
            name: 'María Gómez',
            email: 'maria@example.com',
            role: 'professional',
            banned: false,
            createdAt: '2024-02-20T14:45:00Z'
          },
          {
            id: '3',
            username: 'admin',
            name: 'Administrador',
            email: 'admin@example.com',
            role: 'administrator',
            banned: false,
            createdAt: '2024-01-01T08:00:00Z'
          },
          {
            id: '4',
            username: 'carlosrodriguez',
            name: 'Carlos Rodríguez',
            email: 'carlos@example.com',
            role: 'client',
            banned: true,
            createdAt: '2024-03-10T16:20:00Z'
          }
        ]

        // Simular delay de API
        setTimeout(() => {
          setUsers(mockUsers)
          setLoading(false)
        }, 1000)
      } catch {
        setError('Error al cargar los usuarios')
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      setUpdatingUser(userId)

      // Simular llamada a API
      setTimeout(() => {
        // Actualizar el usuario en el estado local
        setUsers(
          users.map((user: User) =>
            user.id === userId ? { ...user, role: newRole } : user
          )
        )
        setUpdatingUser(null)
        toast.success('Rol actualizado exitosamente', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        })
      }, 500)
    } catch (error) {
      console.error('Error inesperado:', error)
      toast.error('Ocurrió un error inesperado', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
      setUpdatingUser(null)
    }
  }

  const handleBanToggle = async (userId: string, currentBanStatus: boolean) => {
    const action = currentBanStatus ? 'desbanear' : 'banear'
    
    // Mostrar toast de confirmación
    const confirmToast = () => {
      toast.dismiss() // Cerrar toasts anteriores
      toast.warn(
        <div>
          <p>¿Estás seguro de que quieres {action} a este usuario?</p>
          <div className="mt-3 flex space-x-2">
            <button
              onClick={() => {
                toast.dismiss()
                performBanToggle()
              }}
              className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
            >
              Confirmar
            </button>
            <button
              onClick={() => toast.dismiss()}
              className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600"
            >
              Cancelar
            </button>
          </div>
        </div>,
        {
          position: 'top-center',
          autoClose: false,
          hideProgressBar: true,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: false,
          closeButton: false,
        }
      )
    }

    const performBanToggle = async () => {
      try {
        setUpdatingUser(userId)

        // Simular llamada a API
        setTimeout(() => {
          // Actualizar el usuario en el estado local
          setUsers(
            users.map((user: User) =>
              user.id === userId ? { ...user, banned: !currentBanStatus } : user
            )
          )
          setUpdatingUser(null)
          toast.success(`Usuario ${action}do exitosamente`, {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          })
        }, 500)
      } catch (error) {
        console.error('Error inesperado:', error)
        toast.error('Ocurrió un error inesperado', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        })
        setUpdatingUser(null)
      }
    }

    confirmToast()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
    case 'administrator':
      return 'bg-red-100 text-red-800'
    case 'professional':
      return 'bg-blue-100 text-blue-800'
    case 'client':
      return 'bg-green-100 text-green-800'
    default:
      return 'bg-gray-100 text-gray-800'
    }
  }

  const getRoleDisplayName = (role: string) => {
    switch (role) {
    case 'administrator':
      return 'Administrador'
    case 'professional':
      return 'Profesional'
    case 'client':
      return 'Cliente'
    default:
      return role
    }
  }

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Cargando usuarios...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="pattern-bg bg-cover bg-center min-h-[calc(100vh-4rem)] p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg mb-6 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-blue-700 px-6 py-4">
            <h1 className="text-white text-2xl font-bold">
              Panel de Administración
            </h1>
            <p className="text-blue-100 mt-1">
              Gestión de usuarios del sistema
            </p>
          </div>

          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Usuarios Registrados
                </h2>
                <p className="text-gray-600">Total: {users.length} usuarios</p>
              </div>
              <div className="flex space-x-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {users.filter((u) => !u.banned).length} Activos
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  {users.filter((u) => u.banned).length} Baneados
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rol
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha Registro
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user: User) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {user.name || 'Sin nombre'}
                        </div>
                        <div className="text-sm text-gray-500">
                          @{user.username}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <div className="w-[100px]">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}
                          >
                            {getRoleDisplayName(user.role)}
                          </span>
                        </div>
                        <select
                          value={user.role}
                          onChange={(e) =>
                            handleRoleChange(user.id, e.target.value)
                          }
                          title="Cambiar rol"
                          disabled={updatingUser === user.id}
                          className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="client">Cliente</option>
                          <option value="professional">Profesional</option>
                          <option value="administrator">Administrador</option>
                        </select>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.banned
                            ? 'bg-red-100 text-red-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {user.banned ? 'Baneado' : 'Activo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleBanToggle(user.id, user.banned)}
                        disabled={updatingUser === user.id}
                        className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-medium transition-colors duration-200 cursor-pointer w-[82px] justify-center ${
                          user.banned
                            ? 'bg-green-600 hover:bg-green-700 text-white'
                            : 'bg-red-600 hover:bg-red-700 text-white'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {updatingUser === user.id ? (
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                        ) : null}
                        {user.banned ? 'Desbanear' : 'Banear'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {users.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                  />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No hay usuarios
                </h3>
                <p className="text-gray-500">
                  No se encontraron usuarios en el sistema.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {/* <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            <a
              href="/dashboard"
              className="text-blue-500 hover:underline font-medium"
            >
              Volver al dashboard
            </a>
          </p>
        </div> */}
      </div>

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  )
}

export default AdminDashboard

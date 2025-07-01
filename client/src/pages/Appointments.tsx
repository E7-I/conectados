import { useEffect, useState, useCallback } from 'react'
import { toast } from 'react-toastify'

interface Appointment {
  _id?: string
  clientId: string
  professionalId: string
  serviceId: string
  details: {
    date: string
    time: string
    description: string
    location: string
  }
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled'
  responseMessage?: string
}

interface User {
  _id: string
  role: 'professional' | 'client'
}

const Appointments = ({ user }: { user: User }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [newAppointment, setNewAppointment] = useState<Appointment>({
    clientId: user._id,
    professionalId: '',
    serviceId: '',
    details: { date: '', time: '', description: '', location: '' },
    status: 'pending'
  })
  const [filterStatus, setFilterStatus] = useState<string>('all')

  const isProfessional = user.role === 'professional'

  const fakeProfessionals = [
    {
      _id: 'professional1',
      name: 'Juan Pérez',
      service: 'Consulta gasfitería',
      specialty: 'Plomería'
    },
    { 
      _id: 'professional2', 
      name: 'Ana Gómez', 
      service: 'Consulta electrica',
      specialty: 'Electricidad'
    }
  ]

  const fetchAppointments = useCallback(() => {
    // Datos falsos simulando una respuesta del backend
    const appointments: Appointment[] = [
      {
        _id: '1',
        clientId: 'Roberto González',
        professionalId: 'professional1',
        serviceId: 'service1',
        details: {
          date: '2025-05-10',
          time: '10:00',
          description: 'Consulta electrica - Revisión de instalación',
          location: 'Av. Principal 123, Oficina 201'
        },
        status: 'pending'
      },
      {
        _id: '2',
        clientId: 'Juan Pérez',
        professionalId: 'professional1',
        serviceId: 'service1',
        details: {
          date: '2025-05-12',
          time: '14:00',
          description: 'Consulta gasfitería - Reparación de tubería',
          location: 'Calle Secundaria 456, Casa 10'
        },
        status: 'accepted'
      },
      {
        _id: '3',
        clientId: 'María López',
        professionalId: 'professional1',
        serviceId: 'service2',
        details: {
          date: '2025-05-08',
          time: '09:00',
          description: 'Mantenimiento preventivo',
          location: 'Centro Comercial Plaza, Local 45'
        },
        status: 'rejected'
      }
    ]
    
    setAppointments(appointments)
    setLoading(false)
  }, [])

  const handleStatusChange = (
    id: string,
    newStatus: 'pending' | 'accepted' | 'rejected' | 'cancelled'
  ) => {
    setAppointments((prevAppointments) =>
      prevAppointments.map((appt) =>
        appt._id === id ? { ...appt, status: newStatus } : appt
      )
    )
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewAppointment({
      ...newAppointment,
      details: { ...newAppointment.details, [name]: value }
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aquí puedes agregar la lógica para enviar la cita al servidor
    toast.success('Cita agendada con éxito')
    setNewAppointment({
      clientId: user._id,
      professionalId: '',
      serviceId: '',
      details: { date: '', time: '', description: '', location: '' },
      status: 'pending'
    })
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pendiente' },
      accepted: { bg: 'bg-green-100', text: 'text-green-800', label: 'Aceptada' },
      rejected: { bg: 'bg-red-100', text: 'text-red-800', label: 'Rechazada' },
      cancelled: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Cancelada' }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    )
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const filteredAppointments = appointments.filter(appt => 
    filterStatus === 'all' || appt.status === filterStatus
  )

  const getAppointmentStats = () => {
    const total = appointments.length
    const pending = appointments.filter(a => a.status === 'pending').length
    const accepted = appointments.filter(a => a.status === 'accepted').length
    const rejected = appointments.filter(a => a.status === 'rejected').length
    
    return { total, pending, accepted, rejected }
  }

  const stats = getAppointmentStats()

  useEffect(() => {
    fetchAppointments()
  }, [fetchAppointments])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando citas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                {isProfessional ? 'Gestión de Citas' : 'Mis Citas'}
              </h1>
              <p className="text-blue-100">
                Bienvenido, {user.role === 'professional' ? 'Profesional' : 'Cliente'}
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                <div className="text-white text-sm">
                  <div className="font-semibold">Total de citas</div>
                  <div className="text-2xl font-bold">{stats.total}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        {isProfessional && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-full">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
              <div className="flex items-center">
                <div className="p-3 bg-yellow-100 rounded-full">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pendientes</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.pending}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-full">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Aceptadas</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.accepted}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500">
              <div className="flex items-center">
                <div className="p-3 bg-red-100 rounded-full">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Rechazadas</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.rejected}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Appointments List */}
          <div className="lg:col-span-2">
            {/* Filters */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Filtros</h3>
                <div className="flex flex-wrap gap-4">
                  <div>
                    <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-2">
                      Estado
                    </label>
                    <select
                      id="status-filter"
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      title="Filtrar por estado"
                      className="rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
                    >
                      <option value="all">Todos</option>
                      <option value="pending">Pendientes</option>
                      <option value="accepted">Aceptadas</option>
                      <option value="rejected">Rechazadas</option>
                      <option value="cancelled">Canceladas</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Appointments Cards */}
            <div className="bg-white rounded-xl shadow-lg">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-xl p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-900">
                  {isProfessional ? 
                    `Solicitudes de Citas (${filteredAppointments.length})` : 
                    `Mis Citas (${filteredAppointments.length})`
                  }
                </h3>
              </div>
              
              <div className="p-6">
                {filteredAppointments.length === 0 ? (
                  <div className="text-center py-12">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V7a2 2 0 012-2h4a2 2 0 012 2v0M8 7v10a2 2 0 002 2h4a2 2 0 002-2V7m-6 0h6" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No hay citas</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {filterStatus === 'all' ? 'No tienes citas registradas.' : `No hay citas con estado "${filterStatus}".`}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredAppointments.map((appt) => (
                      <div
                        key={appt._id}
                        className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow duration-300"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="text-lg font-semibold text-gray-900">
                                {isProfessional ? `Cliente: ${appt.clientId}` : 'Mi Cita'}
                              </h4>
                              {getStatusBadge(appt.status)}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                              <div className="flex items-center">
                                <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V7a2 2 0 012-2h4a2 2 0 012 2v0M8 7v10a2 2 0 002 2h4a2 2 0 002-2V7m-6 0h6" />
                                </svg>
                                <span><strong>Fecha:</strong> {formatDate(appt.details.date)}</span>
                              </div>
                              <div className="flex items-center">
                                <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span><strong>Hora:</strong> {formatTime(appt.details.time)}</span>
                              </div>
                              <div className="flex items-center">
                                <svg className="w-4 h-4 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span><strong>Ubicación:</strong> {appt.details.location}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <div className="flex items-start">
                            <svg className="w-4 h-4 mr-2 text-gray-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                            </svg>
                            <div>
                              <span className="text-sm text-gray-600"><strong>Descripción:</strong></span>
                              <p className="text-sm text-gray-800 mt-1">{appt.details.description}</p>
                            </div>
                          </div>
                        </div>

                        {appt.status === 'pending' && isProfessional && (
                          <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                            <button
                              className="flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors duration-200"
                              onClick={() => handleStatusChange(appt._id!, 'accepted')}
                            >
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              Aceptar
                            </button>
                            <button
                              className="flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors duration-200"
                              onClick={() => handleStatusChange(appt._id!, 'rejected')}
                            >
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                              Rechazar
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Appointment Form for Clients */}
          {!isProfessional && (
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg sticky top-8">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl p-6 border-b">
                  <h3 className="text-lg font-semibold text-gray-900">Agendar Nueva Cita</h3>
                  <p className="text-sm text-gray-600 mt-1">Complete el formulario para solicitar una cita</p>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  <div>
                    <label htmlFor="professionalId" className="block text-sm font-medium text-gray-700 mb-2">
                      Profesional
                    </label>
                    <select
                      id="professionalId"
                      name="professionalId"
                      value={newAppointment.professionalId}
                      title="Selecciona un profesional"
                      onChange={(e) =>
                        setNewAppointment({
                          ...newAppointment,
                          professionalId: e.target.value
                        })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Selecciona un profesional</option>
                      {fakeProfessionals.map((professional) => (
                        <option key={professional._id} value={professional._id}>
                          {professional.name} - {professional.specialty}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                        Fecha
                      </label>
                      <input
                        type="date"
                        id="date"
                        name="date"
                        value={newAppointment.details.date}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">
                        Hora
                      </label>
                      <input
                        type="time"
                        id="time"
                        name="time"
                        value={newAppointment.details.time}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                      Ubicación
                    </label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={newAppointment.details.location}
                      onChange={handleInputChange}
                      placeholder="Ingrese la dirección"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                      Descripción del servicio
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={newAppointment.details.description}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="Describa detalladamente el servicio que necesita"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                  >
                    Agendar Cita
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Appointments

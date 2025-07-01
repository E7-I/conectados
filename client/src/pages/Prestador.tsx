import { useParams } from 'react-router-dom'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

const categories = [
  'Belleza',
  'Construcción',
  'Gasfitería',
  'Jardinería',
  'Electricidad',
  'Gastronomía',
  'Limpieza',
  'Otro'
]

interface Appointment {
  _id: string
  clientId: string
  serviceId: string
  details: {
    date: string
    time: string
    description: string
    location: {
      lat: number
      lng: number
    }
  }
  status: string
}

interface Service {
  _id: string
  title: string
  description: string
  price: { min: number; max: number }
}

const Prestador = () => {
  const { professionalid } = useParams<{ professionalid: string }>()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null)
  const [selectedHours, setSelectedHours] = useState<number | null>(null)

  // Form state for adding a service
  const [serviceTitle, setServiceTitle] = useState('')
  const [serviceDescription, setServiceDescription] = useState('')
  const [serviceImages, setServiceImages] = useState<string[]>([])
  const [serviceCategories, setServiceCategories] = useState<string[]>([])
  const [servicePriceMin, setServicePriceMin] = useState<number | null>(null)
  const [servicePriceMax, setServicePriceMax] = useState<number | null>(null)

  // Add a new state to store the mapping between request IDs and appointment IDs
  const [requestToAppointmentMap, setRequestToAppointmentMap] = useState<Record<string, string>>({})

  // Get category color for badge
  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Belleza': 'bg-pink-100 text-pink-800',
      'Construcción': 'bg-orange-100 text-orange-800',
      'Gasfitería': 'bg-blue-100 text-blue-800',
      'Jardinería': 'bg-green-100 text-green-800',
      'Electricidad': 'bg-yellow-100 text-yellow-800',
      'Gastronomía': 'bg-red-100 text-red-800',
      'Limpieza': 'bg-purple-100 text-purple-800',
      'Otro': 'bg-gray-100 text-gray-800'
    }
    return colors[category] || 'bg-gray-100 text-gray-800'
  }

  // Get status color for badges
  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'pendiente': 'bg-yellow-100 text-yellow-800',
      'aceptado': 'bg-green-100 text-green-800',
      'rechazado': 'bg-red-100 text-red-800',
      'completado': 'bg-blue-100 text-blue-800',
      'cancelado': 'bg-gray-100 text-gray-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const formatPrice = (min: number, max: number) => {
    const formatter = new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    })
    
    if (min === max) {
      return formatter.format(min)
    }
    return `${formatter.format(min)} - ${formatter.format(max)}`
  }

  useEffect(() => {
    const fetchAppointmentsAndServices = async () => {
      try {
        const appointmentsResponse = await axios.get(
          `https://conectadose7-b5dfgdb2e2fkg2hd.canadacentral-01.azurewebsites.net/api/requests/getRequestByProfessionalId/${professionalid}`
        )
        const appointmentsData: Appointment[] = appointmentsResponse.data

        const servicesResponse = await axios.get(
          `https://conectadose7-b5dfgdb2e2fkg2hd.canadacentral-01.azurewebsites.net/api/services/getServicesProfessionalId/${professionalid}`
        )
        const servicesData: Service[] = servicesResponse.data

        setAppointments(appointmentsData)
        setServices(servicesData)
      } catch (err) {
        console.error('Error fetching appointments or services:', err)
        setError('Failed to fetch data. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    if (professionalid) {
      fetchAppointmentsAndServices()
    }
  }, [professionalid])

  const handleStatusChange = async (
    appointmentId: string, // This is actually requestId
    newStatus: string
  ) => {
    try {
      // Update the status in the backend
      await axios.put('https://conectadose7-b5dfgdb2e2fkg2hd.canadacentral-01.azurewebsites.net/api/requests/changeStatus', {
        requestId: appointmentId,
        status: newStatus
      })

      // Update the status in the frontend
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment._id === appointmentId
            ? { ...appointment, status: newStatus }
            : appointment
        )
      )

      // If the status is set to "aceptado", set the selected appointment
      if (newStatus === 'aceptado') {
        const appointment = appointments.find(
          (appt) => appt._id === appointmentId
        )
        setSelectedAppointment(appointment || null)
      } else {
        setSelectedAppointment(null)
        setSelectedHours(null)
      }
    } catch (err) {
      console.error('Error updating status:', err)
      toast.error('Failed to update status.')
    }
    
    // Update concretado in appointment status for reviews
    if (newStatus === 'completado') {
      try {
        // Get the actual appointment ID from our mapping
        const realAppointmentId = requestToAppointmentMap[appointmentId]
        
        if (realAppointmentId) {
          await axios.put('http://localhost:5000/api/appointments/changeStatus', {
            appointmentId: realAppointmentId, // Use the real appointment ID, the appointmendId var its actually the reqid
            status: 'concretado'
          })
          console.log('✅ Appointment status updated to concretado')
        } else {
          console.warn('⚠️ No appointment ID found for request:', appointmentId)
          toast.error('Could not find corresponding appointment to update.')
        }
      } catch (err) {
        console.error('Error updating appointment status:', err)
        toast.error('Failed to update appointment status.')
      }
    }
  }

  const handleConfirm = async () => {
    if (!selectedAppointment || !selectedHours || selectedHours <= 0) {
      toast.error('Please select a valid number of hours.')
      return
    }

    try {
      const { clientId, serviceId, details } = selectedAppointment
      const service = services.find((s) => s._id === serviceId)

      if (!service) {
        toast.error('Service not found for the appointment.')
        return
      }

      const startDateTime = new Date(details.date)
      const endDateTime = new Date(startDateTime)
      endDateTime.setHours(startDateTime.getHours() + selectedHours)


      const response = await axios.post(
        'https://conectadose7-b5dfgdb2e2fkg2hd.canadacentral-01.azurewebsites.net/api/appointments/createAppointment',

        {
          clientId,
          professionalId: professionalid,
          requestId: selectedAppointment._id,
          serviceId: service._id,
          startDateTime: startDateTime.toISOString(),
          endDateTime: endDateTime.toISOString(),
          serviceTitle: service.title,
          serviceDescription: service.description,
          servicePrice: service.price
        }
      )

      // Store the mapping between request ID and appointment ID
      const appointmentId = response.data._id || response.data.appointment?._id
      if (appointmentId) {
        setRequestToAppointmentMap(prev => ({
          ...prev,
          [selectedAppointment._id]: appointmentId
        }))
      }

      toast.success('Cita agendada exitosamente.')
      setSelectedAppointment(null)
      setSelectedHours(null)
    } catch (err) {
      console.error('Error creating appointment:', err)
      toast.error('Failed to create appointment.')
    }
  }

  const handleAddService = async () => {
    if (
      !serviceTitle ||
      !serviceDescription ||
      !servicePriceMin ||
      !servicePriceMax ||
      serviceCategories.length === 0
    ) {
      toast.error('Please fill in all required fields.')
      return
    }

    try {
      await axios.post('https://conectadose7-b5dfgdb2e2fkg2hd.canadacentral-01.azurewebsites.net/api/services/createservice', {
        professionalid,
        title: serviceTitle,
        description: serviceDescription,
        images: serviceImages,
        categories: serviceCategories,
        price: {
          min: servicePriceMin,
          max: servicePriceMax
        }
      })

      toast.success('Service added successfully!')
      setServiceTitle('')
      setServiceDescription('')
      setServiceImages([])
      setServiceCategories([])
      setServicePriceMin(null)
      setServicePriceMax(null)
    } catch (err) {
      console.error('Error adding service:', err)
      toast.error('Failed to add service.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Cargando información del prestador...</p>
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
              Panel del Prestador
            </h1>
            <p className="text-blue-100 mt-1">
              Gestiona tus citas y servicios
            </p>
          </div>

          <div className="p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Resumen de Actividad
                </h2>
                <p className="text-gray-600">
                  {appointments.length > 0 
                    ? `${appointments.length} ${appointments.length === 1 ? 'cita' : 'citas'} registradas`
                    : 'No hay citas registradas'
                  }
                </p>
              </div>
              <div className="flex flex-wrap gap-2 sm:justify-end">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {appointments.filter((a) => a.status === 'aceptado').length} Aceptadas
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  {appointments.filter((a) => a.status === 'pendiente').length} Pendientes
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {services.length} Servicios
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Duration Selection (if appointment selected) */}
        {selectedAppointment && (
          <div className="bg-white rounded-lg shadow-lg mb-6 overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-green-700 px-6 py-4">
              <h3 className="text-white text-lg font-bold">
                Confirmar Duración del Servicio
              </h3>
              <p className="text-green-100 mt-1 text-sm">
                Selecciona cuántas horas durará el servicio
              </p>
            </div>
            
            <div className="p-6">
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duración del servicio
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={selectedHours || ''}
                    onChange={(e) => setSelectedHours(Number(e.target.value))}
                    title="Seleccionar duración del servicio"
                  >
                    <option value="" disabled>
                      Selecciona las horas
                    </option>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((hour) => (
                      <option key={hour} value={hour}>
                        {hour} hora{hour > 1 ? 's' : ''}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md font-medium transition-colors duration-200"
                  onClick={handleConfirm}
                  disabled={!selectedHours}
                >
                  Confirmar Cita
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Appointments Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500 to-purple-700 px-6 py-4">
                <h2 className="text-white text-xl font-bold">
                  Gestión de Citas
                </h2>
                <p className="text-purple-100 mt-1 text-sm">
                  Administra el estado de tus citas
                </p>
              </div>

              <div className="p-6">
                {appointments.length === 0 ? (
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
                          d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-2 8h2m-2 4h2M8 21l4-4 4 4M3 4h18M4 8h16l-1 8H5L4 8z"
                        />
                      </svg>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No hay citas registradas
                      </h3>
                      <p className="text-gray-500">
                        Las citas solicitadas aparecerán aquí.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Servicio
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Fecha y Hora
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Descripción
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Estado
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Acciones
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {appointments.map((appointment) => {
                          const service = services.find(
                            (s) => s._id === appointment.serviceId
                          )
                          return (
                            <tr key={appointment._id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div>
                                  <div className="text-sm font-medium text-gray-900">
                                    {service ? service.title : 'Servicio no encontrado'}
                                  </div>
                                  {service && (
                                    <div className="text-sm text-gray-500">
                                      {formatPrice(service.price.min, service.price.max)}
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                  {new Date(appointment.details.date).toLocaleDateString('es-ES', {
                                    weekday: 'short',
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                  })}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {appointment.details.time}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="text-sm text-gray-900 max-w-xs truncate">
                                  {appointment.details.description}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                  Lat: {appointment.details.location.lat}, 
                                  Lng: {appointment.details.location.lng}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                                  {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <select
                                  className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  value={appointment.status}
                                  onChange={(e) =>
                                    handleStatusChange(appointment._id, e.target.value)
                                  }
                                  title="Cambiar estado de la cita"
                                >
                                  <option value="pendiente">Pendiente</option>
                                  <option value="aceptado">Aceptado</option>
                                  <option value="rechazado">Rechazado</option>
                                  <option value="completado">Completado</option>
                                  <option value="cancelado">Cancelado</option>
                                </select>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* Add Service Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden sticky top-4">
              <div className="bg-gradient-to-r from-orange-500 to-orange-700 px-6 py-4">
                <h2 className="text-white text-xl font-bold">
                  Agregar Nuevo Servicio
                </h2>
                <p className="text-orange-100 mt-1 text-sm">
                  Expande tu oferta de servicios
                </p>
              </div>

              <div className="p-6">
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Título del Servicio
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={serviceTitle}
                      onChange={(e) => setServiceTitle(e.target.value)}
                      placeholder="Ej: Reparación de grifería"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descripción
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                      value={serviceDescription}
                      onChange={(e) => setServiceDescription(e.target.value)}
                      placeholder="Describe detalladamente tu servicio..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Imágenes del Servicio
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={serviceImages.join(', ')}
                      onChange={(e) =>
                        setServiceImages(
                          e.target.value.split(',').map((url) => url.trim())
                        )
                      }
                      placeholder="URLs separadas por comas"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Ingresa las URLs de las imágenes separadas por comas
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Categorías
                    </label>
                    <select
                      multiple
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={serviceCategories}
                      onChange={(e) =>
                        setServiceCategories(
                          Array.from(e.target.selectedOptions, (option) => option.value)
                        )
                      }
                      size={4}
                      title="Seleccionar categorías del servicio"
                    >
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      Mantén Ctrl/Cmd presionado para seleccionar múltiples categorías
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Precio Mínimo
                      </label>
                      <input
                        type="number"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={servicePriceMin || ''}
                        onChange={(e) => setServicePriceMin(Number(e.target.value))}
                        placeholder="0"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Precio Máximo
                      </label>
                      <input
                        type="number"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={servicePriceMax || ''}
                        onChange={(e) => setServicePriceMax(Number(e.target.value))}
                        placeholder="0"
                        min="0"
                      />
                    </div>
                  </div>

                  {/* Selected Categories Display */}
                  {serviceCategories.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Categorías seleccionadas:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {serviceCategories.map((category, index) => (
                          <span
                            key={index}
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(category)}`}
                          >
                            {category}
                            <button
                              type="button"
                              onClick={() => {
                                setServiceCategories(
                                  serviceCategories.filter((c) => c !== category)
                                )
                              }}
                              className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-gray-200"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleAddService}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md font-medium transition-colors duration-200"
                    disabled={
                      !serviceTitle ||
                      !serviceDescription ||
                      !servicePriceMin ||
                      !servicePriceMax ||
                      serviceCategories.length === 0
                    }
                  >
                    Agregar Servicio
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Current Services Section */}
        {services.length > 0 && (
          <div className="mt-6">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-500 to-indigo-700 px-6 py-4">
                <h2 className="text-white text-xl font-bold">
                  Mis Servicios
                </h2>
                <p className="text-indigo-100 mt-1 text-sm">
                  {services.length} {services.length === 1 ? 'servicio activo' : 'servicios activos'}
                </p>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {services.map((service) => (
                    <div key={service._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {service.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {service.description}
                      </p>
                      <div className="text-sm font-medium text-blue-600">
                        {formatPrice(service.price.min, service.price.max)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Prestador

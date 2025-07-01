import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'

type Appointment = {
  clientId: string
  profesiolanlId: string
  requestId: string
  serviceId: string
  dateTime: { start: string; end: string }
  status: string
}

type Review = {
  _id: string
  serviceId: string
  appointmentId: string
  professionalId: string
  reviewerId: string
  stars: number
  comment: string
  response?: string | null
  createdAt: string
}

type Service = {
  _id: string
  professionalid: string
  title: string
  description: string
  images?: string[]
  video?: string
  categories: string[]
  price: { min: number; max: number }
  averageRating: number
  timesDone: number
}

const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']

const getWeekDates = (startDate: Date) => {
  const monday = new Date(startDate)
  monday.setDate(startDate.getDate() - ((startDate.getDay() + 6) % 7)) // adjust to Monday
  monday.setHours(0, 0, 0, 0)

  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return d
  })
}

const generateTimeSlots = (startHour: number, endHour: number) => {
  const slots = []
  for (let hour = startHour; hour < endHour; hour++) {
    slots.push({ start: hour, end: hour + 1 })
  }
  return slots
}

const getWeeklySchedule = (
  appointments: Appointment[],
  startHour = 8,
  endHour = 18
) => {
  const weekDates = getWeekDates(new Date())
  const slots = generateTimeSlots(startHour, endHour)

  return weekDates.map((date) => {
    return {
      date,
      slots: slots.map(({ start, end }) => {
        const slotStart = new Date(date)
        slotStart.setHours(start, 0, 0, 0)
        const slotEnd = new Date(date)
        slotEnd.setHours(end, 0, 0, 0)

        const isTaken = appointments.some((appt) => {
          const apptStart = new Date(appt.dateTime.start)
          const apptEnd = new Date(appt.dateTime.end)
          return (
            (slotStart >= apptStart && slotStart < apptEnd) ||
            (slotEnd > apptStart && slotEnd <= apptEnd)
          )
        })

        return {
          time: `${start}:00 - ${end}:00`,
          taken: isTaken,
          startDateTime: slotStart.toISOString(),
          endDateTime: slotEnd.toISOString()
        }
      })
    }
  })
}

const ServiceDetail = () => {
  const { id } = useParams()
  const [service, setService] = useState<Service | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [weeklySchedule, setWeeklySchedule] = useState<
    {
      date: Date
      slots: {
        time: string
        taken: boolean
        startDateTime: string
        endDateTime: string
      }[]
    }[]
  >([])
  const [selectedSlot, setSelectedSlot] = useState<{
    startDateTime: string
    endDateTime: string
  } | null>(null)
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState({ lat: '', lng: '' })
  const [userId, setUserId] = useState('')

  // Function to render star rating
  const renderStars = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg
          key={`full-${i}`}
          className="w-5 h-5 text-yellow-400 fill-current"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      )
    }

    // Half star
    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative w-5 h-5">
          <svg
            className="absolute w-5 h-5 text-gray-300 fill-current"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <div className="absolute inset-0 overflow-hidden w-1/2">
            <svg
              className="w-5 h-5 text-yellow-400 fill-current"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
        </div>
      )
    }

    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <svg
          key={`empty-${i}`}
          className="w-5 h-5 text-gray-300 fill-current"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      )
    }

    return stars
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
    const fetchServiceDetails = async () => {
      try {
        const serviceResponse = await axios.get(
          `https://conectadose7-b5dfgdb2e2fkg2hd.canadacentral-01.azurewebsites.net/api/services/getService/${id}`
        )
        const serviceData: Service = serviceResponse.data
        setService(serviceData)
        setSelectedImage(serviceData.images ? serviceData.images[0] : null)

        const appointmentsResponse = await axios.get(
          `https://conectadose7-b5dfgdb2e2fkg2hd.canadacentral-01.azurewebsites.net/api/appointments/getAppointmentByServicelId/${id}`
        )
        const appointmentsData: Appointment[] = appointmentsResponse.data

        const schedule = getWeeklySchedule(appointmentsData)
        setWeeklySchedule(schedule)

        // Fetch reviews by professional ID
        const reviewsResponse = await axios.get(
          `https://conectadose7-b5dfgdb2e2fkg2hd.canadacentral-01.azurewebsites.net/api/reviews/getReviewsByServiceId/${id}`
        )
        const reviewsData: Review[] = reviewsResponse.data
        setReviews(reviewsData)
      } catch (error) {
        console.error('Error fetching service details:', error)
      }
    }

    if (id) {
      fetchServiceDetails()
    }
  }, [id])

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('authToken')
        if (!token) {
          console.error('No authentication token found')
          return
        }

        const response = await axios.get('http://localhost:5000/api/users/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        const user = response.data.user
        setUserId(user._id) // Use _id for MongoDB ObjectId
      } catch (err) {
        console.error('Error fetching user data:', err)
      }
    }

    fetchUserData()
  }, [])

  const handleSlotClick = (slot: {
    startDateTime: string
    endDateTime: string
    taken: boolean
  }) => {
    if (!slot.taken) {
      setSelectedSlot(slot)
    }
  }

  const handleContactClick = async () => {
    if (
      !selectedSlot ||
      !service ||
      !description ||
      !location.lat ||
      !location.lng ||
      !userId // Add this validation
    ) {
      toast.error('Please fill in all fields and ensure you are logged in.')
      return
    }

    const appointmentData = {
      clientId: userId, // Use the actual user ID instead of placeholder
      professionalId: service.professionalid,
      serviceId: service._id,
      details: {
        date: selectedSlot.startDateTime,
        time: `${new Date(selectedSlot.startDateTime).toLocaleTimeString()} - ${new Date(selectedSlot.endDateTime).toLocaleTimeString()}`,
        description,
        location: {
          lat: parseFloat(location.lat),
          lng: parseFloat(location.lng)
        }
      }
    }

    try {
      await axios.post(
        'https://conectadose7-b5dfgdb2e2fkg2hd.canadacentral-01.azurewebsites.net/api/requests/createRequest',
        appointmentData
      )
      toast.success(
        'Has agendado tu cita con éxito! Puedes ver el estado de tu cita en tu perfil.'
      )
      setDescription('') // Clear the form
      setLocation({ lat: '', lng: '' })
      setSelectedSlot(null) // Clear selected slot
    } catch (error) {
      console.error('Error creating request:', error)
      toast.error('Failed to create request.')
    }
  }

  if (!service) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Cargando servicio...</p>
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
              Detalles del Servicio
            </h1>
            <p className="text-blue-100 mt-1">
              Información completa y disponibilidad
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Images */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
              {selectedImage && (
                <div className="relative">
                  <img
                    src={selectedImage}
                    alt="Main Service"
                    className="w-full h-96 object-cover"
                  />
                  {/* Rating overlay */}
                  <div className="absolute top-4 right-4 bg-white rounded-full px-3 py-2 shadow-lg">
                    <div className="flex items-center space-x-2">
                      <div className="flex">
                        {renderStars(service.averageRating)}
                      </div>
                      <span className="text-sm font-bold text-gray-800">
                        {service.averageRating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
              {service.images && service.images.length > 1 && (
                <div className="p-4">
                  <div className="flex gap-3 overflow-x-auto">
                    {service.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`Thumbnail ${idx}`}
                        className={`flex-shrink-0 w-20 h-20 object-cover rounded-lg shadow cursor-pointer transition-all duration-200 ${
                          selectedImage === img 
                            ? 'ring-2 ring-blue-500 scale-105' 
                            : 'hover:scale-105'
                        }`}
                        onClick={() => setSelectedImage(img)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Service Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {service.title}
                </h2>
                
                {/* Rating and Stats */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="flex">
                      {renderStars(service.averageRating)}
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {service.averageRating.toFixed(1)}
                    </span>
                  </div>
                  <span className="text-sm text-gray-600">
                    {service.timesDone} servicios realizados
                  </span>
                </div>

                {/* Categories */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {service.categories.map((category, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {category}
                    </span>
                  ))}
                </div>

                {/* Description */}
                <p className="text-gray-700 mb-6 leading-relaxed">
                  {service.description}
                </p>

                {/* Price */}
                <div className="mb-6">
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">
                    Precio del Servicio
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    {formatPrice(service.price.min, service.price.max)}
                  </p>
                </div>

                {/* Booking Button */}
                <button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md text-lg font-semibold transition-colors duration-200 mb-4"
                  onClick={handleContactClick}
                  disabled={!selectedSlot}
                >
                  {selectedSlot ? 'Confirmar Agendamiento' : 'Selecciona un horario'}
                </button>

                {/* Selected Slot Info */}
                {selectedSlot && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <h3 className="font-medium text-blue-900 mb-2">Horario Seleccionado:</h3>
                    <p className="text-sm text-blue-800">
                      {new Date(selectedSlot.startDateTime).toLocaleDateString('es-ES', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                    <p className="text-sm text-blue-800">
                      {new Date(selectedSlot.startDateTime).toLocaleTimeString('es-ES', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })} - {new Date(selectedSlot.endDateTime).toLocaleTimeString('es-ES', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                )}

                {/* Booking Form */}
                {selectedSlot && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Descripción del servicio requerido
                      </label>
                      <textarea
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe detalladamente lo que necesitas..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ubicación del servicio
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={location.lat}
                          onChange={(e) =>
                            setLocation({ ...location, lat: e.target.value })
                          }
                          placeholder="Latitud"
                        />
                        <input
                          type="text"
                          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={location.lng}
                          onChange={(e) =>
                            setLocation({ ...location, lng: e.target.value })
                          }
                          placeholder="Longitud"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Ingresa las coordenadas donde se realizará el servicio
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* Availability Schedule */}
        {weeklySchedule.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-green-500 to-green-700 px-6 py-4">
              <h2 className="text-white text-xl font-bold">
                Disponibilidad Semanal
              </h2>
              <p className="text-green-100 mt-1 text-sm">
                Selecciona el horario que mejor te convenga
              </p>
            </div>
            
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="border-2 border-gray-200 px-4 py-3 bg-gray-50 text-left text-sm font-semibold text-gray-700">
                        Horario
                      </th>
                      {weeklySchedule.map((day, idx) => (
                        <th key={idx} className="border-2 border-gray-200 px-4 py-3 bg-gray-50 text-center text-sm font-semibold text-gray-700">
                          <div className="font-bold">{DAYS[idx]}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            {day.date.toLocaleDateString('es-ES', { 
                              day: '2-digit', 
                              month: '2-digit' 
                            })}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {generateTimeSlots(8, 18).map((slot, i) => (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="border-2 border-gray-200 px-4 py-3 font-medium bg-gray-50 text-sm">
                          {slot.start}:00 - {slot.end}:00
                        </td>
                        {weeklySchedule.map((day, j) => {
                          const slotData = day.slots[i]
                          const isSelected = selectedSlot?.startDateTime === slotData.startDateTime
                          
                          return (
                            <td
                              key={j}
                              className={`border-2 border-gray-200 px-4 py-3 text-center cursor-pointer transition-all duration-200 text-sm font-medium ${
                                slotData.taken
                                  ? 'bg-red-100 text-red-800 cursor-not-allowed'
                                  : isSelected
                                    ? 'bg-blue-500 text-white shadow-lg scale-105'
                                    : 'bg-green-100 text-green-800 hover:bg-green-200 hover:scale-105'
                              }`}
                              onClick={() => handleSlotClick(slotData)}
                              title={
                                slotData.taken 
                                  ? 'Horario no disponible'
                                  : isSelected
                                    ? 'Horario seleccionado'
                                    : 'Click para seleccionar este horario'
                              }
                            >
                              <div className="flex flex-col items-center">
                                {slotData.taken ? (
                                  <>
                                    <svg className="w-4 h-4 mb-1" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                    <span>Ocupado</span>
                                  </>
                                ) : isSelected ? (
                                  <>
                                    <svg className="w-4 h-4 mb-1" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span>Seleccionado</span>
                                  </>
                                ) : (
                                  <>
                                    <svg className="w-4 h-4 mb-1" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span>Disponible</span>
                                  </>
                                )}
                              </div>
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Legend */}
              <div className="mt-6 flex flex-wrap gap-4 justify-center">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-100 border-2 border-gray-200 rounded"></div>
                  <span className="text-sm text-gray-600">Disponible</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-blue-500 border-2 border-gray-200 rounded"></div>
                  <span className="text-sm text-gray-600">Seleccionado</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-red-100 border-2 border-gray-200 rounded"></div>
                  <span className="text-sm text-gray-600">Ocupado</span>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Reviews Section */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-purple-500 to-purple-700 px-6 py-4">
            <h2 className="text-white text-xl font-bold">
              Opiniones de Clientes
            </h2>
            <p className="text-purple-100 mt-1 text-sm">
              {reviews.length > 0 
                ? `${reviews.length} ${reviews.length === 1 ? 'opinión' : 'opiniones'} de clientes`
                : 'Sé el primero en dejar una opinión'
              }
            </p>
          </div>
          
          <div className="p-6">
            {reviews.length === 0 ? (
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
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Sin opiniones aún
                  </h3>
                  <p className="text-gray-500">
                    Este servicio aún no tiene opiniones de clientes.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {reviews.map((review, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Cliente</p>
                          <p className="text-xs text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString('es-ES', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <div className="flex">
                          {renderStars(review.stars)}
                        </div>
                        <span className="text-sm font-semibold text-gray-700">
                          {review.stars}/5
                        </span>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-gray-800 leading-relaxed">
                        {review.comment}
                      </p>
                    </div>
                    
                    {review.response && (
                      <div className="mt-4 bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0">
                            <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenoeven" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-blue-900 mb-1">
                              Respuesta del profesional:
                            </p>
                            <p className="text-sm text-blue-800">
                              {review.response}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
export default ServiceDetail

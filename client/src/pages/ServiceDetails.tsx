import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

type Appointment = {
  clientId: string;
  profesiolanlId: string;
  requestId: string;
  serviceId: string;
  dateTime: { start: string; end: string };
  status: string;
};

type Review = {
  _id: string;
  serviceId: string;
  appointmentId: string;
  professionalId: string;
  reviewerId: string;
  stars: number;
  comment: string;
  response?: string | null;
  createdAt: string;
};

type Service = {
  _id: string;
  professionalid: string;
  title: string;
  description: string;
  images?: string[];
  video?: string;
  categories: string[];
  price: { min: number; max: number };
  averageRating: number;
  timesDone: number;
};

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
          endDateTime: slotEnd.toISOString(),
        }
      }),
    }
  })
}

const ServiceDetail = () => {
  const { id } = useParams()
  const [service, setService] = useState<Service | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [weeklySchedule, setWeeklySchedule] = useState<
    { date: Date; slots: { time: string; taken: boolean; startDateTime: string; endDateTime: string }[] }[]
  >([])
  const [selectedSlot, setSelectedSlot] = useState<{
    startDateTime: string;
    endDateTime: string;
  } | null>(null)
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState({ lat: '', lng: '' })

  useEffect(() => {
    const fetchServiceDetails = async () => {
      try {
        const serviceResponse = await axios.get(
          `http://localhost:5000/api/services/getService/${id}`
        )
        const serviceData: Service = serviceResponse.data
        setService(serviceData)
        setSelectedImage(serviceData.images ? serviceData.images[0] : null)

        const appointmentsResponse = await axios.get(
          `http://localhost:5000/api/appointments/getAppointmentByServicelId/${id}` 
        )
        const appointmentsData: Appointment[] = appointmentsResponse.data

        const schedule = getWeeklySchedule(appointmentsData)
        setWeeklySchedule(schedule)

        // Fetch reviews by professional ID
        const reviewsResponse = await axios.get(
          `http://localhost:5000/api/reviews/getReviewsByServiceId/${id}`
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

  const handleSlotClick = (slot: { startDateTime: string; endDateTime: string }) => {
    if (!slot.taken) {
      setSelectedSlot(slot)
    }
  }

  const handleContactClick = async () => {
    if (!selectedSlot || !service || !description || !location.lat || !location.lng) {
      alert('Please fill in all fields.')
      return
    }

    const appointmentData = {
      clientId: '663c2a87f4e31b1c9ef75abc', // placeholder, should be the actual client id,
      professionalId: service.professionalid,
      serviceId: service._id,
      details: {
        date: selectedSlot.startDateTime,
        time: `${new Date(selectedSlot.startDateTime).toLocaleTimeString()} - ${new Date(selectedSlot.endDateTime).toLocaleTimeString()}`,
        description,
        location: {
          lat: parseFloat(location.lat),
          lng: parseFloat(location.lng),
        },
      },
    }

    try {
      await axios.post(
        'http://localhost:5000/api/requests/createRequest',
        appointmentData
      )
      alert('Has agendado tu cita con éxito!\nPuedes ver el estado de tu cita en tu perfil.')
      setDescription('') // Clear the form
      setLocation({ lat: '', lng: '' })
    } catch (error) {
      console.error('Error creating request:', error)
      alert('Failed to create request.')
    }
  }

  if (!service) return <div className="text-center py-20">Cargando servicio...</div>

  return (
    <div className="pattern-bg bg-cover bg-center min-h-[calc(100vh-4rem)] flex items-center justify-center">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column: Images */}
          <div>
            {selectedImage && (
              <div className="mb-4">
                <img
                  src={selectedImage}
                  alt="Main Service"
                  className="w-full h-96 object-cover rounded-lg shadow"
                />
              </div>
            )}
            {service.images && service.images.length > 1 && (
              <div className="flex gap-2">
                {service.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`Thumbnail ${idx}`}
                    className={`w-20 h-20 object-cover rounded-lg shadow cursor-pointer ${
                      selectedImage === img ? 'ring-2 ring-blue-500' : ''
                    }`}
                    onClick={() => setSelectedImage(img)}
                  />
                ))}
              </div>
            )}
          </div>
          {/* Right Column: Details */}
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{service.title}</h1>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-yellow-500 text-lg">⭐ {service.averageRating.toFixed(1)}</span>
              <span className="text-gray-600">({service.timesDone} servicios realizados)</span>
            </div>
            <p className="text-gray-700 mb-6">{service.description}</p>
            <div className="mb-6">
              <p className="text-2xl font-semibold text-blue-600">
                ${service.price.min.toLocaleString()} - ${service.price.max.toLocaleString()}
              </p>
            </div>
            <button
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-full text-lg font-semibold transition shadow w-full mb-4"
              onClick={handleContactClick}
            >
              Agendar
            </button>
            {/* Conditionally Render Form */}
            {selectedSlot && (
              <div className="mt-4">
                <label className="block text-gray-700 font-medium mb-2">Descripción:</label>
                <textarea
                  className="w-full p-2 border rounded-lg mb-4"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Escribe una descripción para la solicitud..."
                ></textarea>
                <label className="block text-gray-700 font-medium mb-2">Ubicación:</label>
                <div className="flex gap-4">
                  <input
                    type="text"
                    className="w-1/2 p-2 border rounded-lg"
                    value={location.lat}
                    onChange={(e) => setLocation({ ...location, lat: e.target.value })}
                    placeholder="Latitud"
                  />
                  <input
                    type="text"
                    className="w-1/2 p-2 border rounded-lg"
                    value={location.lng}
                    onChange={(e) => setLocation({ ...location, lng: e.target.value })}
                    placeholder="Longitud"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Disponibilidad */}
        {weeklySchedule.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Disponibilidad semanal</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-center border-collapse">
                <thead>
                  <tr>
                    <th className="border px-2 py-2 bg-gray-100">Horario</th>
                    {weeklySchedule.map((day, idx) => (
                      <th key={idx} className="border px-2 py-2 bg-gray-100">
                        {DAYS[idx]}
                        <br />
                        {day.date.toLocaleDateString()}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {generateTimeSlots(8, 18).map((slot, i) => (
                    <tr key={i}>
                      <td className="border px-2 py-1 font-medium bg-gray-50">
                        {slot.start}:00 - {slot.end}:00
                      </td>
                      {weeklySchedule.map((day, j) => {
                        const slotData = day.slots[i]
                        return (
                          <td
                            key={j}
                            className={`border px-2 py-2 cursor-pointer ${
                              slotData.taken
                                ? 'bg-red-200 text-red-800'
                                : selectedSlot?.startDateTime === slotData.startDateTime
                                  ? 'bg-blue-200 text-blue-800'
                                  : 'bg-green-100 text-green-800'
                            }`}
                            onClick={() => handleSlotClick(slotData)}
                          >
                            {slotData.taken ? 'Ocupado' : 'Disponible'}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {/* Reviews Section */}
        {(
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Opiniones de clientes</h2>
            <div className="space-y-6">
              {reviews.map((rev, idx) => (
                <div key={idx} className="bg-gray-100 p-4 rounded-lg shadow">
                  <div className="flex justify-between mb-1">
                    <span className="font-semibold text-gray-800">{rev.comment}</span>
                    <span className="text-yellow-500">⭐ {rev.stars}/5</span>
                  </div>
                  {rev.response && (
                    <p className="text-gray-500 text-sm mt-2">Respuesta: {rev.response}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
    </div>
    
  )
}

export default ServiceDetail

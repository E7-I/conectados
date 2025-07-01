import { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

//im sorry for doing this but my brain is barely working after the ia certamen
//its ok :3

interface Appointment {
  _id: string
  serviceId: string
  professionalId: string
  startDateTime: string
  status: string
}

interface Service {
  _id: string
  title: string
  description: string
}

interface Review {
  _id: string
  serviceId: Service
  appointmentId: string
  professionalId: string
  reviewerId: string
  stars: number
  comment: string
}

const UserReviews = () => {
  const [userId, setUserId] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [completedAppointments, setCompletedAppointments] = useState<
    Appointment[]
  >([])
  const [servicesMap, setServicesMap] = useState<Record<string, Service>>({})
  const [showReviewForm, setShowReviewForm] = useState<string | null>(null)
  const [reviewStars, setReviewStars] = useState(5)
  const [reviewComment, setReviewComment] = useState('')
  const [reviewSubmitting, setReviewSubmitting] = useState(false)
  const [reviewsMap, setReviewsMap] = useState<Record<string, Review>>({})
  const [userReviews, setUserReviews] = useState<Review[]>([])

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('authToken')
        if (!token) {
          setError('No se encontró el token de autenticación')
          setLoading(false)
          return
        }

        const response = await axios.get('https://conectadose7-b5dfgdb2e2fkg2hd.canadacentral-01.azurewebsites.net/api/users/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        const user = response.data.user
        setUserId(user._id) // Use _id instead of id for MongoDB ObjectId
        setLoading(false)
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(
            err.response?.data?.message ||
              'Error al cargar los datos del usuario'
          )
        } else {
          setError('Ocurrió un error inesperado')
        }
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  useEffect(() => {
    const fetchCompletedAppointments = async () => {
      if (!userId) return
      try {
        const token = localStorage.getItem('authToken')
        const response = await axios.get(
          `https://conectadose7-b5dfgdb2e2fkg2hd.canadacentral-01.azurewebsites.net/api/appointments/getAppointmentByClientId/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        )
        // Filter only completed appointments
        const completed = response.data.filter(
          (appt: Appointment) => appt.status === 'concretado'
        )
        setCompletedAppointments(completed)

        // Fetch all unique service data in parallel and store in a map
        const uniqueServiceIds = [
          ...new Set(completed.map((appt: Appointment) => appt.serviceId))
        ]
        const serviceResponses = await Promise.all(
          uniqueServiceIds.map((id) =>
            axios
              .get(`https://conectadose7-b5dfgdb2e2fkg2hd.canadacentral-01.azurewebsites.net/api/services/getService/${id}`)
              .then((res) => ({ id: id as string, data: res.data }))
              .catch(() => ({ id: id as string, data: null }))
          )
        )
        const map: Record<string, Service> = {}
        serviceResponses.forEach((s) => {
          if (s.data) map[s.id] = s.data
        })
        setServicesMap(map)
      } catch {
        // handle error if needed
      }
    }
    fetchCompletedAppointments()
  }, [userId])

  useEffect(() => {
    // Fetch reviews for all completed appointments for this user
    const fetchReviews = async () => {
      if (!userId) return
      try {
        const token = localStorage.getItem('authToken')
        const response = await axios.get(
          `https://conectadose7-b5dfgdb2e2fkg2hd.canadacentral-01.azurewebsites.net/api/reviews/getReviewsByReviewerId/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        // Map reviews by appointmentId for quick lookup
        const map: Record<string, Review> = {}
        response.data.forEach((review: Review) => {
          map[review.appointmentId] = review
        })
        setReviewsMap(map)
        setUserReviews(response.data) // <-- store all reviews for display
      } catch {
        // handle error if needed
      }
    }
    fetchReviews()
  }, [userId, completedAppointments])

  const handleReviewSubmit = async (appt: Appointment) => {
    setReviewSubmitting(true)
    try {
      const token = localStorage.getItem('authToken')
      await axios.post(
        'https://conectadose7-b5dfgdb2e2fkg2hd.canadacentral-01.azurewebsites.net/api/reviews/createReview',
        {
          serviceId: appt.serviceId,
          appointmentId: appt._id,
          professionalId: appt.professionalId,
          reviewerId: userId,
          stars: reviewStars,
          comment: reviewComment
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      // Cambiar el estado de la cita a "finalizado"
      await axios.put(
        'https://conectadose7-b5dfgdb2e2fkg2hd.canadacentral-01.azurewebsites.net/api/appointments/changeStatus',
        {
          appointmentId: appt._id,
          status: 'finalizado'
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      toast.success('¡Reseña enviada!')
      setShowReviewForm(null)
      setReviewComment('')
      setReviewStars(5)
      // Refresca la página para evitar doble reseña
      window.location.reload()
    } catch {
      toast.error('Error al enviar la reseña')
    }
    setReviewSubmitting(false)
  }

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <p>Cargando datos del usuario...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  return (
    <div className="pattern-bg bg-cover bg-center min-h-[calc(100vh-4rem)] p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-lg mb-6 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-blue-700 px-6 py-8">
            <h1 className="text-white text-3xl font-bold text-center">
              Reseñas y Citas Completadas
            </h1>
            <p className="text-blue-100 text-center mt-2">
              Revisa tus citas completadas y las reseñas que has dejado
            </p>
          </div>
        </div>

        {/* Completed Appointments Section */}
        <div className="bg-white rounded-lg shadow-lg mb-6 overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-green-700 px-6 py-4">
            <h2 className="text-white text-xl font-bold">Citas Completadas</h2>
            <p className="text-green-100 text-sm">
              Agrega reseñas a tus citas completadas
            </p>
          </div>
          <div className="p-6">
            {completedAppointments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No tienes citas completadas aún.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {completedAppointments.map((appt) => {
                  const service = servicesMap[appt.serviceId]
                  const review = reviewsMap[appt._id]
                  return (
                    <div
                      key={appt._id}
                      className="border rounded-lg p-4 bg-gray-50"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <strong className="text-gray-700">Servicio:</strong>
                          <p className="text-gray-900">
                            {service ? service.title : 'Cargando...'}
                          </p>
                        </div>
                        <div>
                          <strong className="text-gray-700">Fecha:</strong>
                          <p className="text-gray-900">
                            {appt.startDateTime
                              ? new Date(appt.startDateTime).toLocaleString()
                              : 'Sin fecha'}
                          </p>
                        </div>
                      </div>

                      {review ? (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <div className="flex items-center mb-2">
                            <strong className="text-green-800 mr-2">
                              Tu reseña:
                            </strong>
                            <span className="text-yellow-500">
                              {'★'.repeat(review.stars)}
                              {'☆'.repeat(5 - review.stars)}
                            </span>
                          </div>
                          <p className="text-green-700">{review.comment}</p>
                        </div>
                      ) : (
                        <div className="border-t pt-4">
                          <button
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                            onClick={() => setShowReviewForm(appt._id)}
                          >
                            Agregar Reseña
                          </button>
                          {showReviewForm === appt._id && (
                            <div className="mt-4 p-4 bg-white border rounded-lg">
                              <form
                                onSubmit={(e) => {
                                  e.preventDefault()
                                  handleReviewSubmit(appt)
                                }}
                              >
                                <div className="mb-4">
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Calificación:
                                  </label>
                                  <select
                                    value={reviewStars}
                                    onChange={(e) =>
                                      setReviewStars(Number(e.target.value))
                                    }
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    aria-label="Seleccionar calificación"
                                  >
                                    {[1, 2, 3, 4, 5].map((n) => (
                                      <option key={n} value={n}>
                                        {n} estrella{n > 1 ? 's' : ''}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                                <div className="mb-4">
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Comentario:
                                  </label>
                                  <textarea
                                    value={reviewComment}
                                    onChange={(e) =>
                                      setReviewComment(e.target.value)
                                    }
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    maxLength={500}
                                    required
                                    placeholder="Comparte tu experiencia con este servicio..."
                                  />
                                  <p className="text-sm text-gray-500 mt-1">
                                    {reviewComment.length}/500 caracteres
                                  </p>
                                </div>
                                <div className="flex gap-3">
                                  <button
                                    type="submit"
                                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                                    disabled={reviewSubmitting}
                                  >
                                    {reviewSubmitting
                                      ? 'Enviando...'
                                      : 'Enviar Reseña'}
                                  </button>
                                  <button
                                    type="button"
                                    className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg transition-colors"
                                    onClick={() => setShowReviewForm(null)}
                                  >
                                    Cancelar
                                  </button>
                                </div>
                              </form>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* User Reviews Section */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-purple-500 to-purple-700 px-6 py-4">
            <h2 className="text-white text-xl font-bold">
              Historial de Reseñas
            </h2>
            <p className="text-purple-100 text-sm">
              Todas las reseñas que has dejado
            </p>
          </div>
          <div className="p-6">
            {userReviews.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No has dejado reseñas aún.</p>
                <p className="text-sm mt-2">
                  ¡Completa tus primeras citas para comenzar a dejar reseñas!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {userReviews.map((review) => (
                  <div
                    key={review._id}
                    className="border rounded-lg p-4 bg-gray-50"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {review.serviceId?.title || 'Sin título'}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {review.serviceId?.description || 'Sin descripción'}
                        </p>
                      </div>
                      <div className="text-yellow-500 text-lg ml-4">
                        {'★'.repeat(review.stars)}
                        {'☆'.repeat(5 - review.stars)}
                      </div>
                    </div>
                    <div className="bg-white p-3 rounded border-l-4 border-l-purple-500">
                      <p className="text-gray-700 italic">"{review.comment}"</p>
                    </div>
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

export default UserReviews

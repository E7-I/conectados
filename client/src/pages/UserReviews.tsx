import React from 'react'
import axios from 'axios'
import { useState, useEffect } from 'react'

//im sorry for doing this but my brain is barely working after the ia certamen

const UserReviews = () => {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    name: '',
    email: '',
    password: '',
    role: 'client',
    profile: {
      bio: '',
      photoUrl: '',
      contactInfo: [] as ContactInfo[]
    },
    location: {
      address: '',
      lat: 0,
      lng: 0
    },
    professionalData: {
      availability: [{ dayOfWeek: 'Lunes', startHour: '', endHour: '' }],
      certifications: [],
      averageRating: 0
    }
  })

  const [userId, setUserId] = useState('')
  const [errors, setErrors] = useState<Errors>({
    username: '',
    name: '',
    email: '',
    password: '',
    profile: { bio: '', photoUrl: '', contactInfo: [] },
    location: { address: '', lat: '', lng: '' },
    professionalData: { availability: [], certifications: [] }
  })

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [completedAppointments, setCompletedAppointments] = useState<any[]>([])
  const [servicesMap, setServicesMap] = useState<Record<string, any>>({})
  const [showReviewForm, setShowReviewForm] = useState<string | null>(null)
  const [reviewStars, setReviewStars] = useState(5)
  const [reviewComment, setReviewComment] = useState('')
  const [reviewSubmitting, setReviewSubmitting] = useState(false)
  const [reviewsMap, setReviewsMap] = useState<Record<string, any>>({})
  const [userReviews, setUserReviews] = useState<any[]>([])

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('authToken')
        if (!token) {
          setError('No se encontró el token de autenticación')
          setLoading(false)
          return
        }

        const response = await axios.get('http://localhost:5000/api/users/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        const user = response.data.user
        setUserId(user._id)
        setFormData({
          username: user.username || '',
          name: user.name || '',
          email: user.email || '',
          password: '',
          role: user.role || 'client',
          profile: {
            bio: user.profile?.bio || '',
            photoUrl: user.profile?.photoUrl || '',
            contactInfo: user.profile?.contactInfo || [] // Use empty array if no contactInfo
          },
          location: {
            address: user.location?.address || '',
            lat: user.location?.lat || 0,
            lng: user.location?.lng || 0
          },
          professionalData: {
            availability:
              user.professionalData?.availability?.length > 0
                ? user.professionalData.availability
                : [{ dayOfWeek: 'Lunes', startHour: '', endHour: '' }],
            certifications:
              user.professionalData?.certifications?.length > 0
                ? user.professionalData.certifications
                : [], // Changed to empty array
            averageRating: user.professionalData?.averageRating || 0
          }
        })
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
          `http://localhost:5000/api/appointments/getAppointmentByClientId/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        )
        // Filter only completed appointments
        const completed = response.data.filter(
          (appt: any) => appt.status === 'concretado'
        )
        setCompletedAppointments(completed)

        // Fetch all unique service data in parallel and store in a map
        const uniqueServiceIds = [
          ...new Set(completed.map((appt: any) => appt.serviceId))
        ]
        const serviceResponses = await Promise.all(
          uniqueServiceIds.map((id) =>
            axios
              .get(`http://localhost:5000/api/services/getService/${id}`)
              .then((res) => ({ id, data: res.data }))
              .catch(() => ({ id, data: null }))
          )
        )
        const map: Record<string, any> = {}
        serviceResponses.forEach((s) => {
          if (s.data) map[s.id] = s.data
        })
        setServicesMap(map)
      } catch (err) {
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
          `http://localhost:5000/api/reviews/getReviewsByReviewerId/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        // Map reviews by appointmentId for quick lookup
        const map: Record<string, any> = {}
        response.data.forEach((review: any) => {
          map[review.appointmentId] = review
        })
        setReviewsMap(map)
        setUserReviews(response.data) // <-- store all reviews for display
      } catch (err) {
        // handle error if needed
      }
    }
    fetchReviews()
  }, [userId, completedAppointments])

  const handleReviewSubmit = async (appt: any) => {
    setReviewSubmitting(true)
    try {
      const token = localStorage.getItem('authToken')
      await axios.post(
        'http://localhost:5000/api/reviews/createReview',
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
        'http://localhost:5000/api/appointments/changeStatus',
        {
          appointmentId: appt._id,
          status: 'finalizado'
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      alert('¡Reseña enviada!')
      setShowReviewForm(null)
      setReviewComment('')
      setReviewStars(5)
      // Refresca la página para evitar doble reseña
      window.location.reload()
    } catch (err) {
      alert('Error al enviar la reseña')
    }
    setReviewSubmitting(false)
  }

  interface ContactInfo {
    type: string
    value: string
  }

  interface Profile {
    bio: string
    photoUrl: string
    contactInfo: ContactInfo[]
  }

  interface Location {
    address: string
    lat: number | string
    lng: number | string
  }

  interface Availability {
    dayOfWeek: string
    startHour: string
    endHour: string
  }

  interface Certification {
    name: string
    description: string
    url: string
  }

  interface ProfessionalData {
    availability: Availability[]
    certifications: Certification[]
    averageRating: number
  }

  interface FormData {
    username: string
    name: string
    email: string
    password: string
    role: string
    profile: Profile
    location: Location
    professionalData: ProfessionalData
  }

  interface Errors {
    username: string
    name: string
    email: string
    password: string
    profile: {
      bio: string
      photoUrl: string
      contactInfo: string[]
    }
    location: {
      address: string
      lat: string
      lng: string
    }
    professionalData: {
      availability: string[]
      certifications: string[]
    }
  }

  const validateForm = () => {
    const newErrors: Errors = {
      username: '',
      name: '',
      email: '',
      password: '',
      profile: { bio: '', photoUrl: '', contactInfo: [] as string[] },
      location: { address: '', lat: '', lng: '' },
      professionalData: {
        availability: [] as string[],
        certifications: [] as string[]
      }
    }
    let isValid = true

    if (formData.username && formData.username.length < 3) {
      newErrors.username =
        'El nombre de usuario debe tener al menos 3 caracteres'
      isValid = false
    }

    if (formData.name && formData.name.length < 1) {
      newErrors.name = 'El nombre es obligatorio'
      isValid = false
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Correo electrónico inválido'
      isValid = false
    }

    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres'
      isValid = false
    }

    if (
      formData.profile.photoUrl &&
      !/^https?:\/\/.+\..+/.test(formData.profile.photoUrl)
    ) {
      newErrors.profile.photoUrl = 'URL de la foto inválida'
      isValid = false
    }

    if (
      formData.location.lat &&
      (Number(formData.location.lat) < -90 ||
        Number(formData.location.lat) > 90)
    ) {
      newErrors.location.lat = 'Latitud debe estar entre -90 y 90'
      isValid = false
    }

    if (
      formData.location.lng &&
      (Number(formData.location.lng) < -180 ||
        Number(formData.location.lng) > 180)
    ) {
      newErrors.location.lng = 'Longitud debe estar entre -180 y 180'
      isValid = false
    }

    formData.profile.contactInfo.forEach((contact, index) => {
      if (!contact.type) {
        newErrors.profile.contactInfo[index] = 'Tipo de contacto requerido'
        isValid = false
      }
      if (!contact.value) {
        newErrors.profile.contactInfo[index] = 'Valor de contacto requerido'
        isValid = false
      }
    })

    // Validate professionalData for non-client roles
    if (formData.role !== 'client') {
      formData.professionalData.availability.forEach((avail, index) => {
        if (!avail.dayOfWeek) {
          newErrors.professionalData.availability[index] = 'Día requerido'
          isValid = false
        }
        if (
          !avail.startHour ||
          !/^[0-2][0-9]:[0-5][0-9]$/.test(avail.startHour)
        ) {
          newErrors.professionalData.availability[index] =
            'Hora de inicio inválida (HH:MM)'
          isValid = false
        }
        if (!avail.endHour || !/^[0-2][0-9]:[0-5][0-9]$/.test(avail.endHour)) {
          newErrors.professionalData.availability[index] =
            'Hora de fin inválida (HH:MM)'
          isValid = false
        }
      })

      // Validate certifications only for professional role and if certifications exist
      if (
        formData.role === 'professional' &&
        formData.professionalData.certifications.length > 0
      ) {
        formData.professionalData.certifications.forEach((cert, index) => {
          if (!cert.name) {
            newErrors.professionalData.certifications[index] =
              'Nombre de certificación requerido'
            isValid = false
          }
          if (!cert.url || !/^https?:\/\/.+\..+/.test(cert.url)) {
            newErrors.professionalData.certifications[index] =
              'URL de certificación inválida'
            isValid = false
          }
        })
      }
    }

    setErrors(newErrors)
    return isValid
  }

  interface Updates {
    username: string
    name: string
    email: string
    password?: string
    role: string
    profile: Profile
    location: {
      address: string
      lat: number
      lng: number
    }
    professionalData?: {
      availability: Availability[]
      certifications?: Certification[]
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    const updates: Updates = {
      username: formData.username,
      name: formData.name,
      email: formData.email,
      password: formData.password || undefined,
      role: formData.role,
      profile: {
        bio: formData.profile.bio,
        photoUrl: formData.profile.photoUrl,
        contactInfo: formData.profile.contactInfo.filter(
          (c) => c.type && c.value
        )
      },
      location: {
        address: formData.location.address,
        lat: Number(formData.location.lat),
        lng: Number(formData.location.lng)
      },
      // Include professionalData for non-client roles
      ...(formData.role !== 'client' && {
        professionalData: {
          availability: formData.professionalData.availability.filter(
            (a) => a.dayOfWeek && a.startHour && a.endHour
          ),
          // Include certifications only for professional role
          ...(formData.role === 'professional' && {
            certifications: formData.professionalData.certifications.filter(
              (c) => c.name && c.url
            )
          })
        }
      })
    }

    try {
      const token = localStorage.getItem('authToken')
      if (!token) {
        alert('No se encontró el token de autenticación')
        return
      }

      const response = await axios.put(
        `http://localhost:5000/api/users/update/${userId}`,
        updates,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (response.status === 200) {
        alert('Perfil actualizado exitosamente')
        console.log('Usuario actualizado:', response.data.user)
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message || 'Error al actualizar el perfil'
        alert(message)
        if (error.response?.status === 404) {
          console.error('Usuario no encontrado')
        }
      } else {
        console.error('Error inesperado:', error)
        alert('Ocurrió un error inesperado')
      }
    }
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
    <div className="pattern-bg bg-cover bg-center min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <div className="flex flex-col w-full max-w-4xl rounded-lg shadow-lg overflow-hidden bg-white">
        {/* Left Panel */}
        <div className="w-full bg-gradient-to-b from-blue-500 to-blue-700 flex items-center justify-center p-6 md:p-8">
          <h2 className="text-white text-2xl font-bold text-center">
            Reseñas y Citas Completadas
          </h2>
        </div>
        {/* Completed Appointments Section */}
        <div className="w-full max-w-4xl mx-auto mt-8">
          <h2 className="text-xl font-bold mb-4">Citas completadas</h2>
          {completedAppointments.length === 0 ? (
            <p>No tienes citas completadas.</p>
          ) : (
            <ul>
              {completedAppointments.map((appt) => {
                const service = servicesMap[appt.serviceId]
                const review = reviewsMap[appt._id]
                return (
                  <li key={appt._id} className="mb-2 border-b pb-2">
                    <div>
                      <strong>Servicio:</strong>{' '}
                      {service ? service.title : 'Cargando...'}
                    </div>
                    <div>
                      <strong>Fecha:</strong>{' '}
                      {appt.startDateTime
                        ? new Date(appt.startDateTime).toLocaleString()
                        : 'Sin fecha'}
                    </div>
                    {review ? (
                      <div className="mt-2 bg-green-50 border border-green-200 rounded p-2">
                        <div>
                          <strong>Tu reseña:</strong>
                        </div>
                        <div>
                          <strong>Estrellas:</strong> {review.stars}
                        </div>
                        <div>
                          <strong>Comentario:</strong> {review.comment}
                        </div>
                      </div>
                    ) : (
                      <>
                        <button
                          className="mt-2 px-3 py-1 bg-blue-500 text-white rounded"
                          onClick={() => setShowReviewForm(appt._id)}
                        >
                          Agregar reseña
                        </button>
                        {showReviewForm === appt._id && (
                          <form
                            className="mt-2"
                            onSubmit={(e) => {
                              e.preventDefault()
                              handleReviewSubmit(appt)
                            }}
                          >
                            <label>
                              Estrellas:
                              <select
                                value={reviewStars}
                                onChange={(e) =>
                                  setReviewStars(Number(e.target.value))
                                }
                                className="ml-2"
                              >
                                {[1, 2, 3, 4, 5].map((n) => (
                                  <option key={n} value={n}>
                                    {n}
                                  </option>
                                ))}
                              </select>
                            </label>
                            <br />
                            <label>
                              Comentario:
                              <textarea
                                value={reviewComment}
                                onChange={(e) => setReviewComment(e.target.value)}
                                className="ml-2 border rounded w-full"
                                maxLength={500}
                                required
                              />
                            </label>
                            <br />
                            <button
                              type="submit"
                              className="mt-2 px-3 py-1 bg-green-600 text-white rounded"
                              disabled={reviewSubmitting}
                            >
                              {reviewSubmitting ? 'Enviando...' : 'Enviar reseña'}
                            </button>
                            <button
                              type="button"
                              className="ml-2 px-3 py-1 bg-gray-400 text-white rounded"
                              onClick={() => setShowReviewForm(null)}
                            >
                              Cancelar
                            </button>
                          </form>
                        )}
                      </>
                    )}
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        {/* Aquí va la sección de reseñas */}
        <div className="w-full max-w-4xl mx-auto mt-12">
          <h2 className="text-xl font-bold mb-4">Tus reseñas</h2>
          {userReviews.length === 0 ? (
            <p>No has dejado reseñas aún.</p>
          ) : (
            <ul>
              {userReviews.map((review: any) => (
                <li key={review._id} className="mb-4 border-b pb-2">
                  <div>
                    <strong>Servicio:</strong> {review.serviceId?.title || 'Sin título'}
                  </div>
                  <div>
                    <strong>Descripción:</strong> {review.serviceId?.description || 'Sin descripción'}
                  </div>
                  <div>
                    <strong>Estrellas:</strong> {review.stars}
                  </div>
                  <div>
                    <strong>Comentario:</strong> {review.comment}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

export default UserReviews

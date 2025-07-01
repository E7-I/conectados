import axios from 'axios'
import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'

const UserSettings = () => {
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
        setUserId(user.id)
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    setErrors({ ...errors, [name]: '' })
  }

  type HandleNestedChangeSection = 'profile' | 'location'
  type HandleNestedChangeField = string

  const handleNestedChange = (
    section: HandleNestedChangeSection,
    field: HandleNestedChangeField,
    value: string
  ) => {
    setFormData({
      ...formData,
      [section]: { ...formData[section], [field]: value }
    })
    setErrors({
      ...errors,
      [section]: { ...errors[section], [field]: '' }
    })
  }

  const handleContactChange = (
    index: number,
    field: 'type' | 'value',
    value: string
  ) => {
    const newContactInfo: ContactInfo[] = [...formData.profile.contactInfo]
    newContactInfo[index] = { ...newContactInfo[index], [field]: value }
    setFormData({
      ...formData,
      profile: { ...formData.profile, contactInfo: newContactInfo }
    })
    setErrors({
      ...errors,
      profile: { ...errors.profile, contactInfo: [] }
    })
  }

  const addContact = () => {
    setFormData({
      ...formData,
      profile: {
        ...formData.profile,
        contactInfo: [
          ...formData.profile.contactInfo,
          { type: 'email', value: '' }
        ]
      }
    })
  }

  interface RemoveContact {
    (index: number): void
  }

  const removeContact: RemoveContact = (index) => {
    setFormData({
      ...formData,
      profile: {
        ...formData.profile,
        contactInfo: formData.profile.contactInfo.filter((_, i) => i !== index)
      }
    })
  }

  interface HandleAvailabilityChange {
    (index: number, field: keyof Availability, value: string): void
  }

  const handleAvailabilityChange: HandleAvailabilityChange = (
    index,
    field,
    value
  ) => {
    const newAvailability = [...formData.professionalData.availability]
    newAvailability[index] = { ...newAvailability[index], [field]: value }
    setFormData({
      ...formData,
      professionalData: {
        ...formData.professionalData,
        availability: newAvailability
      }
    })
    setErrors({
      ...errors,
      professionalData: { ...errors.professionalData, availability: [] }
    })
  }

  const addAvailability = () => {
    setFormData({
      ...formData,
      professionalData: {
        ...formData.professionalData,
        availability: [
          ...formData.professionalData.availability,
          { dayOfWeek: 'Lunes', startHour: '', endHour: '' }
        ]
      }
    })
  }

  interface RemoveAvailability {
    (index: number): void
  }

  const removeAvailability: RemoveAvailability = (index) => {
    setFormData({
      ...formData,
      professionalData: {
        ...formData.professionalData,
        availability: formData.professionalData.availability.filter(
          (_, i) => i !== index
        )
      }
    })
  }

  interface HandleCertificationChange {
    (index: number, field: keyof Certification, value: string): void
  }

  const handleCertificationChange: HandleCertificationChange = (
    index,
    field,
    value
  ) => {
    const newCertifications = [...formData.professionalData.certifications]
    newCertifications[index] = { ...newCertifications[index], [field]: value }
    setFormData({
      ...formData,
      professionalData: {
        ...formData.professionalData,
        certifications: newCertifications
      }
    })
    setErrors({
      ...errors,
      professionalData: { ...errors.professionalData, certifications: [] }
    })
  }

  const addCertification = () => {
    setFormData({
      ...formData,
      professionalData: {
        ...formData.professionalData,
        certifications: [
          ...formData.professionalData.certifications,
          { name: '', description: '', url: '' }
        ]
      }
    })
  }

  interface RemoveCertification {
    (index: number): void
  }

  const removeCertification: RemoveCertification = (index) => {
    setFormData({
      ...formData,
      professionalData: {
        ...formData.professionalData,
        certifications: formData.professionalData.certifications.filter(
          (_, i) => i !== index
        )
      }
    })
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
        toast.error('No se encontró el token de autenticación')
        return
      }

      const response = await axios.put(
        `https://conectadose7-b5dfgdb2e2fkg2hd.canadacentral-01.azurewebsites.net/api/users/update/${userId}`,
        updates,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (response.status === 200) {
        toast.success('Perfil actualizado exitosamente')
        console.log('Usuario actualizado:', response.data.user)
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message || 'Error al actualizar el perfil'
        toast.error(message)
        if (error.response?.status === 404) {
          console.error('Usuario no encontrado')
        }
      } else {
        console.error('Error inesperado:', error)
        toast.error('Ocurrió un error inesperado')
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
            CONFIGURACIÓN
          </h2>
        </div>

        {/* Right Panel - Form */}
        <div className="w-full p-6 md:p-8">
          <h1 className="text-xl font-bold text-center mb-6">
            Configuración de Perfil
          </h1>
          <form onSubmit={handleSubmit}>
            {/* Username */}
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
                className={`mt-1 block w-full border rounded-md p-2 ${
                  errors.username ? 'border-red-500' : 'border-gray-300'
                }`}
                minLength={3}
                maxLength={30}
              />
              {errors.username && (
                <p className="text-red-500 text-xs mt-1">{errors.username}</p>
              )}
            </div>

            {/* Name */}
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium">
                Nombre real
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Ej: Juan Pérez"
                value={formData.name}
                onChange={handleChange}
                className={`mt-1 block w-full border rounded-md p-2 ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                minLength={1}
                maxLength={50}
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium">
                Correo electrónico
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Ej: juan@example.com"
                value={formData.email}
                onChange={handleChange}
                className={`mt-1 block w-full border rounded-md p-2 ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium">
                Nueva contraseña (opcional)
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`mt-1 block w-full border rounded-md p-2 ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                minLength={6}
                maxLength={20}
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            {/* Role */}
            <div className="mb-4">
              <label htmlFor="role" className="block text-sm font-medium">
                Rol
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="mt-1 block w-full border rounded-md p-2 border-gray-300"
              >
                <option value="client">Cliente</option>
                <option value="professional">Profesional</option>
                <option value="administrator">Administrador</option>
              </select>
            </div>

            {/* Profile: Bio */}
            <div className="mb-4">
              <label htmlFor="bio" className="block text-sm font-medium">
                Biografía
              </label>
              <textarea
                id="bio"
                name="bio"
                placeholder="Ej: Soy un desarrollador con 5 años de experiencia..."
                value={formData.profile.bio}
                onChange={(e) =>
                  handleNestedChange('profile', 'bio', e.target.value)
                }
                className="mt-1 block w-full border rounded-md p-2 border-gray-300"
                rows={4}
                maxLength={500}
              />
            </div>

            {/* Profile: Photo URL */}
            <div className="mb-4">
              <label htmlFor="photoUrl" className="block text-sm font-medium">
                URL de la foto
              </label>
              <input
                type="url"
                id="photoUrl"
                name="photoUrl"
                placeholder="Ej: https://example.com/photo.jpg"
                value={formData.profile.photoUrl}
                onChange={(e) =>
                  handleNestedChange('profile', 'photoUrl', e.target.value)
                }
                className={`mt-1 block w-full border rounded-md p-2 ${
                  errors.profile.photoUrl ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.profile.photoUrl && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.profile.photoUrl}
                </p>
              )}
            </div>

            {/* Profile: Contact Info */}
            <div className="mb-4">
              <label className="block text-sm font-medium">
                Información de contacto
              </label>
              {formData.profile.contactInfo.length > 0 ? (
                formData.profile.contactInfo.map((contact, index) => (
                  <div key={index} className="flex space-x-2 mb-2">
                    <select
                      value={contact.type}
                      onChange={(e) =>
                        handleContactChange(index, 'type', e.target.value)
                      }
                      className="mt-1 block w-1/3 border rounded-md p-2 border-gray-300"
                      aria-label="Tipo de contacto"
                    >
                      <option value="email">Email</option>
                      <option value="phone">Teléfono</option>
                      <option value="linkedin">LinkedIn</option>
                      <option value="whatsapp">WhatsApp</option>
                      <option value="website">Sitio web</option>
                      <option value="other">Otro</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Ej: juan@example.com"
                      value={contact.value}
                      onChange={(e) =>
                        handleContactChange(index, 'value', e.target.value)
                      }
                      className={`mt-1 block w-2/3 border rounded-md p-2 ${
                        errors.profile.contactInfo[index]
                          ? 'border-red-500'
                          : 'border-gray-300'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => removeContact(index)}
                      className="mt-1 bg-red-500 text-white px-2 py-1 rounded-md"
                    >
                      -
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">
                  No hay métodos de contacto agregados.
                </p>
              )}
              {errors.profile.contactInfo.some((e) => e) && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.profile.contactInfo.find((e) => e)}
                </p>
              )}
              <button
                type="button"
                onClick={addContact}
                className="mt-2 bg-green-500 text-white px-4 py-1 rounded-md"
              >
                Agregar método de contacto
              </button>
            </div>

            {/* Location: Address */}
            <div className="mb-4">
              <label htmlFor="address" className="block text-sm font-medium">
                Dirección
              </label>
              <input
                type="text"
                id="address"
                name="address"
                placeholder="Ej: Av. Siempre Viva 123"
                value={formData.location.address}
                onChange={(e) =>
                  handleNestedChange('location', 'address', e.target.value)
                }
                className="mt-1 block w-full border rounded-md p-2 border-gray-300"
                maxLength={100}
              />
            </div>

            {/* Professional Data: Shown only for professional or administrator roles */}
            {formData.role !== 'client' && (
              <>
                {/* Professional Data: Availability */}
                <div className="mb-4">
                  <label className="block text-sm font-medium">
                    Disponibilidad
                  </label>
                  {formData.professionalData.availability.map(
                    (avail, index) => (
                      <div key={index} className="flex space-x-2 mb-2">
                        <select
                          value={avail.dayOfWeek}
                          onChange={(e) =>
                            handleAvailabilityChange(
                              index,
                              'dayOfWeek',
                              e.target.value
                            )
                          }
                          className="mt-1 block w-1/3 border rounded-md p-2 border-gray-300"
                          aria-label="Día de la semana"
                        >
                          <option value="Lunes">Lunes</option>
                          <option value="Martes">Martes</option>
                          <option value="Miércoles">Miércoles</option>
                          <option value="Jueves">Jueves</option>
                          <option value="Viernes">Viernes</option>
                          <option value="Sábado">Sábado</option>
                          <option value="Domingo">Domingo</option>
                        </select>
                        <input
                          type="text"
                          placeholder="Ej: 09:00"
                          value={avail.startHour}
                          onChange={(e) =>
                            handleAvailabilityChange(
                              index,
                              'startHour',
                              e.target.value
                            )
                          }
                          className={`mt-1 block w-1/3 border rounded-md p-2 ${
                            errors.professionalData.availability[index]
                              ? 'border-red-500'
                              : 'border-gray-300'
                          }`}
                        />
                        <input
                          type="text"
                          placeholder="Ej: 17:00"
                          value={avail.endHour}
                          onChange={(e) =>
                            handleAvailabilityChange(
                              index,
                              'endHour',
                              e.target.value
                            )
                          }
                          className={`mt-1 block w-1/3 border rounded-md p-2 ${
                            errors.professionalData.availability[index]
                              ? 'border-red-500'
                              : 'border-gray-300'
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => removeAvailability(index)}
                          className="mt-1 bg-red-500 text-white px-2 py-1 rounded-md"
                          disabled={
                            formData.professionalData.availability.length === 1
                          }
                        >
                          -
                        </button>
                      </div>
                    )
                  )}
                  {errors.professionalData.availability.some((e) => e) && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.professionalData.availability.find((e) => e)}
                    </p>
                  )}
                  <button
                    type="button"
                    onClick={addAvailability}
                    className="mt-2 bg-green-500 text-white px-4 py-1 rounded-md"
                  >
                    Agregar disponibilidad
                  </button>
                </div>

                {/* Professional Data: Certifications (Shown only for professional role) */}
                {formData.role === 'professional' && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium">
                      Certificaciones
                    </label>
                    {formData.professionalData.certifications.length > 0 ? (
                      formData.professionalData.certifications.map(
                        (cert, index) => (
                          <div key={index} className="mb-2">
                            <input
                              type="text"
                              placeholder="Nombre de la certificación"
                              value={cert.name}
                              onChange={(e) =>
                                handleCertificationChange(
                                  index,
                                  'name',
                                  e.target.value
                                )
                              }
                              className={`mt-1 block w-full border rounded-md p-2 ${
                                errors.professionalData.certifications[index]
                                  ? 'border-red-500'
                                  : 'border-gray-300'
                              }`}
                            />
                            <textarea
                              placeholder="Descripción (opcional)"
                              value={cert.description}
                              onChange={(e) =>
                                handleCertificationChange(
                                  index,
                                  'description',
                                  e.target.value
                                )
                              }
                              className="mt-1 block w-full border rounded-md p-2 border-gray-300"
                              rows={2}
                            />
                            <input
                              type="url"
                              placeholder="URL de la certificación"
                              value={cert.url}
                              onChange={(e) =>
                                handleCertificationChange(
                                  index,
                                  'url',
                                  e.target.value
                                )
                              }
                              className={`mt-1 block w-full border rounded-md p-2 ${
                                errors.professionalData.certifications[index]
                                  ? 'border-red-500'
                                  : 'border-gray-300'
                              }`}
                            />
                            <button
                              type="button"
                              onClick={() => removeCertification(index)}
                              className="mt-1 bg-red-500 text-white px-2 py-1 rounded-md"
                            >
                              Eliminar
                            </button>
                          </div>
                        )
                      )
                    ) : (
                      <p className="text-gray-500 text-sm">
                        No hay certificaciones agregadas.
                      </p>
                    )}
                    {errors.professionalData.certifications.some((e) => e) && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.professionalData.certifications.find((e) => e)}
                      </p>
                    )}
                    <button
                      type="button"
                      onClick={addCertification}
                      className="mt-2 bg-green-500 text-white px-4 py-1 rounded-md"
                    >
                      Agregar certificación
                    </button>
                  </div>
                )}
              </>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md w-full cursor-pointer hover:bg-blue-700 transition duration-200"
            >
              Actualizar Perfil
            </button>
            <p className="text-sm text-center text-gray-600 mt-4">
              <a
                href="/profile"
                className="text-blue-500 hover:underline font-medium"
              >
                Volver al perfil
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default UserSettings

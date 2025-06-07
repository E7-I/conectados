import { useEffect, useState } from 'react'

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

  const isProfessional = user.role === 'professional'

  // Datos falsos simulando una respuesta del backend
  const fakeAppointments: Appointment[] = [
    {
      _id: '1',
      clientId: 'Roberto',
      professionalId: 'professional1',
      serviceId: 'service1',
      details: {
        date: '2025-05-10',
        time: '10:00',
        description: 'Consulta electrica',
        location: 'Consultorio 1'
      },
      status: 'pending'
    },
    {
      _id: '2',
      clientId: 'juan',
      professionalId: 'professional1',
      serviceId: 'service1',
      details: {
        date: '2025-05-12',
        time: '14:00',
        description: 'Consulta gasfitería',
        location: 'Consultorio 2'
      },
      status: 'pending'
    }
  ]

  const fakeProfessionals = [
    {
      _id: 'professional1',
      name: 'Juan Pérez',
      service: 'Consulta gasfitería'
    },
    { _id: 'professional2', name: 'Ana Gómez', service: 'Consulta electrica' }
  ]

  const fetchAppointments = () => {
    setAppointments(fakeAppointments)
    setLoading(false)
  }

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewAppointment({
      ...newAppointment,
      details: { ...newAppointment.details, [name]: value }
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aquí puedes agregar la lógica para enviar la cita al servidor
    alert('Cita agendada con éxito')
    setNewAppointment({
      clientId: user._id,
      professionalId: '',
      serviceId: '',
      details: { date: '', time: '', description: '', location: '' },
      status: 'pending'
    })
  }

  useEffect(() => {
    fetchAppointments()
  })

  if (loading) return <p>Cargando...</p>

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        {isProfessional ? 'Solicitudes de Citas' : 'Mis Citas'}
      </h1>

      <p className="mb-4">
        Bienvenido, {user.role === 'professional' ? 'Profesional' : 'Cliente'}.
      </p>

      {!isProfessional ? (
        <p></p>
      ) : appointments.length === 0 ? (
        <p>No hay citas registradas.</p>
      ) : (
        <div className="space-y-4">
          {appointments.filter((appt) => appt.status === 'pending').length ===
          0 ? (
              <p>No hay solicitudes pendientes.</p>
            ) : (
              appointments
                .filter((appt) => appt.status === 'pending')
                .map((appt) => (
                  <div
                    key={appt._id}
                    className="border rounded-lg p-4 shadow-md bg-white"
                  >
                    <p>
                      <strong>Cliente:</strong> {appt.clientId}
                    </p>
                  </div>
                ))
            )}
          {appointments.map((appt) => (
            <div
              key={appt._id}
              className="border rounded-lg p-4 shadow-md bg-white"
            >
              <p>
                <strong>Cliente:</strong> {appt.clientId}
              </p>
              <p>
                <strong>Fecha:</strong> {appt.details.date} {appt.details.time}
              </p>
              <p>
                <strong>Descripción:</strong> {appt.details.description}
              </p>
              <p>
                <strong>Ubicación:</strong> {appt.details.location}
              </p>
              <p>
                <strong>Estado:</strong> {appt.status}
              </p>
              {appt.status === 'pending' && (
                <div className="mt-2 space-x-2">
                  <button
                    className="bg-green-500 text-white px-3 py-1 rounded"
                    onClick={() => handleStatusChange(appt._id!, 'accepted')}
                  >
                    Aceptar
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded"
                    onClick={() => handleStatusChange(appt._id!, 'rejected')}
                  >
                    Rechazar
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Formulario para que el cliente agende una cita */}
      {!isProfessional && (
        <div className="mt-8 p-4 border rounded-lg bg-white shadow-md">
          <h2 className="text-xl mb-4">Agendar Cita</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="professionalId"
                className="block text-sm font-medium"
              >
                Elija un Profesional
              </label>
              <select
                name="professionalId"
                value={newAppointment.professionalId}
                title="Selecciona un profesional"
                onChange={(e) =>
                  setNewAppointment({
                    ...newAppointment,
                    professionalId: e.target.value
                  })
                }
                className="mt-1 block w-full border rounded-md p-2"
                required
              >
                <option value="">Selecciona un profesional</option>
                {fakeProfessionals.map((professional) => (
                  <option key={professional._id} value={professional._id}>
                    {professional.name} - {professional.service}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label htmlFor="date" className="block text-sm font-medium">
                Fecha
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={newAppointment.details.date}
                onChange={handleInputChange}
                className="mt-1 block w-full border rounded-md p-2"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="time" className="block text-sm font-medium">
                Hora
              </label>
              <input
                type="time"
                id="time"
                name="time"
                value={newAppointment.details.time}
                onChange={handleInputChange}
                className="mt-1 block w-full border rounded-md p-2"
                required
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="description"
                className="block text-sm font-medium"
              >
                Descripción
              </label>
              <input
                type="text"
                id="description"
                name="description"
                value={newAppointment.details.description}
                onChange={handleInputChange}
                className="mt-1 block w-full border rounded-md p-2"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="location" className="block text-sm font-medium">
                Ubicación
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={newAppointment.details.location}
                onChange={handleInputChange}
                className="mt-1 block w-full border rounded-md p-2"
                required
              />
            </div>

            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              Agendar Cita
            </button>
          </form>
        </div>
      )}
    </div>
  )
}

export default Appointments

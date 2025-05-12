import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

interface Appointment {
  _id: string;
  clientId: string;
  serviceId: string;
  details: {
    date: string;
    time: string;
    description: string;
    location: {
      lat: number;
      lng: number;
    };
  };
  status: string;
}

interface Service {
  _id: string;
  title: string;
  description: string;
  price: { min: number; max: number };
}

const Prestador = () => {
  const { professionalid } = useParams<{ professionalid: string }>();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [selectedHours, setSelectedHours] = useState<number | null>(null);

  useEffect(() => {
    const fetchAppointmentsAndServices = async () => {
      try {
        const appointmentsResponse = await axios.get(
          `http://localhost:5000/api/requests/getRequestByProfessionalId/${professionalid}`
        );
        const appointmentsData: Appointment[] = appointmentsResponse.data;

        const servicesResponse = await axios.get(
          `http://localhost:5000/api/services/getServicesProfessionalId/${professionalid}`
        );
        const servicesData: Service[] = servicesResponse.data;

        setAppointments(appointmentsData);
        setServices(servicesData);
      } catch (err) {
        console.error('Error fetching appointments or services:', err);
        setError('Failed to fetch data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (professionalid) {
      fetchAppointmentsAndServices();
    }
  }, [professionalid]);

  const handleStatusChange = (appointmentId: string, newStatus: string) => {
    if (newStatus === 'aceptado') {
      const appointment = appointments.find((appt) => appt._id === appointmentId);
      setSelectedAppointment(appointment || null);
    } else {
      setSelectedAppointment(null);
      setSelectedHours(null);
      updateStatus(appointmentId, newStatus);
    }
  };

  const updateStatus = async (appointmentId: string, newStatus: string) => {
    try {
      await axios.put('http://localhost:5000/api/requests/changeStatus', {
        requestId: appointmentId,
        status: newStatus,
      });

      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment._id === appointmentId ? { ...appointment, status: newStatus } : appointment
        )
      );
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update status.');
    }
  };

  const handleConfirm = async () => {
    if (!selectedAppointment || !selectedHours || selectedHours <= 0) {
      alert('Please select a valid number of hours.');
      return;
    }

    try {
      const { clientId, serviceId, details } = selectedAppointment;
      const service = services.find((s) => s._id === serviceId);

      if (!service) {
        alert('Service not found for the appointment.');
        return;
      }

      const startDateTime = new Date(details.date);
      const endDateTime = new Date(startDateTime);
      endDateTime.setHours(startDateTime.getHours() + selectedHours);

      await axios.post('http://localhost:5000/api/appointments/createAppointment', {
        clientId,
        professionalId: professionalid,
        requestId: selectedAppointment._id,
        serviceId: service._id,
        startDateTime: startDateTime.toISOString(),
        endDateTime: endDateTime.toISOString(),
        serviceTitle: service.title,
        serviceDescription: service.description,
        servicePrice: service.price,
      });

      alert('Cita agendada exitosamente.');
      setSelectedAppointment(null);
      setSelectedHours(null);
    } catch (err) {
      console.error('Error creating appointment:', err);
      alert('Failed to create appointment.');
    }
  };

  if (loading) {
    return <div className="text-center py-20">Cargando citas...</div>;
  }

  if (error) {
    return <div className="text-center py-20 text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-bold text-blue-700 mb-6">Citas del Prestador</h1>
        {selectedAppointment && (
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Selecciona la duración del servicio:</label>
            <select
              className="border border-gray-300 rounded px-2 py-1"
              value={selectedHours || ''}
              onChange={(e) => setSelectedHours(Number(e.target.value))}
            >
              <option value="" disabled>
                Cuantas Horas
              </option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((hour) => (
                <option key={hour} value={hour}>
                  {hour} hora{hour > 1 ? 's' : ''}
                </option>
              ))}
            </select>
            <button
              className="ml-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={handleConfirm}
            >
              Confirmar
            </button>
          </div>
        )}
        {appointments.length === 0 ? (
          <p className="text-gray-600">No hay citas registradas para este prestador.</p>
        ) : (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-blue-100">
                <th className="border border-gray-300 px-4 py-2">Servicio</th>
                <th className="border border-gray-300 px-4 py-2">Fecha</th>
                <th className="border border-gray-300 px-4 py-2">Hora</th>
                <th className="border border-gray-300 px-4 py-2">Descripción</th>
                <th className="border border-gray-300 px-4 py-2">Ubicación</th>
                <th className="border border-gray-300 px-4 py-2">Estado</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => {
                const service = services.find((s) => s._id === appointment.serviceId);
                return (
                  <tr key={appointment._id} className="hover:bg-gray-100">
                    <td className="border border-gray-300 px-4 py-2">
                      {service ? service.title : 'Servicio no encontrado'}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {new Date(appointment.details.date).toLocaleDateString()}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">{appointment.details.time}</td>
                    <td className="border border-gray-300 px-4 py-2">{appointment.details.description}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      Lat: {appointment.details.location.lat}, Lng: {appointment.details.location.lng}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <select
                        className="border border-gray-300 rounded px-2 py-1"
                        value={appointment.status}
                        onChange={(e) => handleStatusChange(appointment._id, e.target.value)}
                      >
                        <option value="pendiente">Pendiente</option>
                        <option value="aceptado">Aceptado</option>
                        <option value="rechazado">Rechazado</option>
                        <option value="completado">Completado</option>
                        <option value="cancelado">Cancelado</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Prestador;

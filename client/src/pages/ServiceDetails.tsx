import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

{/*Dummy data para testear*/ }
const mockService = {
  _id: '1',
  professionalid: '64f1b2c3d4e5f6a7b8c9d0e1', // Matches ObjectId type in User schema
  title: 'Electricista Certificado',
  description:
    'Servicio profesional de electricidad para hogares y empresas. Instalaciones, reparaciones y mantenimiento.',
  images: [
    'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.descripciondepuestos.org%2Fwp-content%2Fuploads%2F2024%2F09%2FqYsoj5VWwgjmhODX6t3Ot-1.png&f=1&nofb=1&ipt=c74627c068e2f675c424207223ae237dde30a5a016d4823a93a8849de37eb4a5',
    'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.electricien-illkirch-crh.fr%2Fdata%2Fuploads%2F2020%2F10%2Fartisan_electricien-1.jpeg&f=1&nofb=1&ipt=fd0948402083d098caa7f62c0b22851d03d89edeb7de63c0e6f0c73b6808c1ad',
  ],
  video: 'https://www.w3schools.com/html/mov_bbb.mp4',
  categories: ['Electricidad', 'Construcción'],
  price: { min: 30000, max: 80000 },
  averageRating: 4.6,
  timesDone: 457,
  reviews: [
    {
      _id: '64f1b2c3d4e5f6a7b8c9d0e2', // Matches ObjectId type in Review schema
      serviceId: '1',
      appointmentId: '64f1b2c3d4e5f6a7b8c9d0e3', // Matches ObjectId type in Appointment schema
      professionalId: '64f1b2c3d4e5f6a7b8c9d0e1',
      reviewerId: '64f1b2c3d4e5f6a7b8c9d0e4',
      stars: 5,
      comment: 'Muy buen trabajo, rápido y eficiente.',
      response: 'Gracias por tu comentario!',
      createdAt: '2023-10-01T10:00:00Z',
    },
    {
      _id: '64f1b2c3d4e5f6a7b8c9d0e5',
      serviceId: '1',
      appointmentId: '64f1b2c3d4e5f6a7b8c9d0e6',
      professionalId: '64f1b2c3d4e5f6a7b8c9d0e1',
      reviewerId: '64f1b2c3d4e5f6a7b8c9d0e7',
      stars: 4,
      comment: 'El servicio fue correcto, pero llegó un poco tarde.',
      response: null,
      createdAt: '2023-10-02T15:30:00Z',
    },
  ],
};

type Appointment = {
  clientId: string;
  profesiolanlId: string;
  requestId: string;
  serviceId: string;
  dateTime: { start: string; end: string };
  status: string;
};

const mockAppointments: Appointment[] = [
  {
    clientId: 'user123',
    profesiolanlId: '64f1b2c3d4e5f6a7b8c9d0e1',
    requestId: 'req1',
    serviceId: '1',
    dateTime: {
      start: '2025-05-03T10:00:00Z',
      end: '2025-05-03T11:00:00Z',
    },
    status: 'agendado',
  },
  {
    clientId: 'user456',
    profesiolanlId: '64f1b2c3d4e5f6a7b8c9d0e1',
    requestId: 'req2',
    serviceId: '1',
    dateTime: {
      start: '2025-05-03T13:00:00Z',
      end: '2025-05-03T14:00:00Z',
    },
    status: 'agendado',
  },
  {
    clientId: 'user456',
    profesiolanlId: '64f1b2c3d4e5f6a7b8c9d0e1',
    requestId: 'req2',
    serviceId: '1',
    dateTime: {
      start: '2025-04-29T13:00:00Z',
      end: '2025-04-29T14:00:00Z',
    },
    status: 'agendado',
  },
];


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
  reviews?: Review[];
};


{/* Disponibilidad semanal related */}
const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

const getWeekDates = (startDate: Date) => {
  const monday = new Date(startDate);
  monday.setDate(startDate.getDate() - ((startDate.getDay() + 6) % 7)); // adjust to Monday
  monday.setHours(0, 0, 0, 0);

  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
};

const generateTimeSlots = (startHour: number, endHour: number) => {
  const slots = [];
  for (let hour = startHour; hour < endHour; hour++) {
    slots.push({ start: hour, end: hour + 1 });
  }
  return slots;
};

const getWeeklySchedule = (
  appointments: Appointment[],
  startHour = 8,
  endHour = 18
) => {
  const weekDates = getWeekDates(new Date());
  const slots = generateTimeSlots(startHour, endHour);

  return weekDates.map((date) => {
    return {
      date,
      slots: slots.map(({ start, end }) => {
        const slotStart = new Date(date);
        slotStart.setHours(start, 0, 0, 0);
        const slotEnd = new Date(date);
        slotEnd.setHours(end, 0, 0, 0);

        const isTaken = appointments.some((appt) => {
          const apptStart = new Date(appt.dateTime.start);
          const apptEnd = new Date(appt.dateTime.end);
          return (
            (slotStart >= apptStart && slotStart < apptEnd) ||
            (slotEnd > apptStart && slotEnd <= apptEnd)
          );
        });

        return {
          time: `${start}:00 - ${end}:00`,
          taken: isTaken,
        };
      }),
    };
  });
};

const ServiceDetail = () => {
  const { id } = useParams();
  const [service, setService] = useState<Service | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [weeklySchedule, setWeeklySchedule] = useState<
  { date: Date; slots: { time: string; taken: boolean }[] }[]
>([]);

  useEffect(() => {
    if (id === '1') {
      setService(mockService);
      setSelectedImage(mockService.images ? mockService.images[0] : null);

      const schedule = getWeeklySchedule(mockAppointments);
      setWeeklySchedule(schedule);
    }
  }, [id]);

  if (!service) return <div className="text-center py-20">Cargando servicio...</div>;

  return (
    <div className="pattern-bg bg-cover bg-center min-h-screen flex items-center justify-center">
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
            <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-full text-lg font-semibold transition shadow w-full mb-4">
            Contactar 
            </button>
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
                        const slotData = day.slots[i];
                        return (
                          <td
                            key={j}
                            className={`border px-2 py-2 ${
                              slotData.taken
                                ? 'bg-red-200 text-red-800'
                                : 'bg-green-100 text-green-800'
                            }`}
                          >
                            {slotData.taken ? 'Ocupado' : 'Disponible'}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {/* Reviews Section */}
        {service.reviews && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Opiniones de clientes</h2>
            <div className="space-y-6">
              {service.reviews.map((rev, idx) => (
                <div key={idx} className="bg-gray-100 p-4 rounded-lg shadow">
                  <div className="flex justify-between mb-1">
                    <span className="font-semibold text-gray-800">{rev.comment}</span>
                    <span className="text-yellow-500">⭐ {rev.stars}/5</span>
                  </div>
                  <p className="text-gray-700 text-sm">{rev.comment}</p>
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
  );
};

export default ServiceDetail;

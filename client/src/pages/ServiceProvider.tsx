import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
 // Importa las funciones de la API

export interface ServiceProvider {
  id: string;
  name: string;
  profilePicture?: string;
  category: string;
  location: string;
  averageRating: number;
  totalReviews: number;
  description: string;
  services: {
    id: string;
    name: string;
    price: number;
    duration: number;
  }[];
}

export interface Review {
  id: string;
  reviewerName: string;
  stars: number;
  comment: string;
  createdAt: string;
}

export async function getServiceProvider(id: string): Promise<ServiceProvider> {
  // Example implementation: Replace with actual API call
  return {
    id,
    name: "John Doe",
    profilePicture: "/default-avatar.png",
    category: "Plumbing",
    location: "New York, NY",
    averageRating: 4.5,
    totalReviews: 20,
    description: "Experienced plumber with over 10 years of experience.",
    services: [
      { id: "1", name: "Pipe Repair", price: 100, duration: 60 },
      { id: "2", name: "Drain Cleaning", price: 80, duration: 45 },
    ],
  };
}
export async function getReviewsByProvider(providerId: string): Promise<Review[]> {
  const response = await fetch(`/api/reviews?providerId=${providerId}`);
  if (!response.ok) {
    throw new Error('Error al obtener las reseñas');
  }
  return response.json();
}

const ServiceProviderProfile = () => {
  const { id } = useParams(); // ID del prestador de servicios desde la URL
  const [provider, setProvider] = useState<ServiceProvider | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    if (id) {
      getServiceProvider(id)
        .then((data) => setProvider(data))
        .catch((error) => console.error(error));

      getReviewsByProvider(id)
        .then((data) => setReviews(data))
        .catch((error) => console.error(error));
    }
  }, [id]);

  if (!provider) return <p>Cargando...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Información del perfil */}
      <div className="flex items-center space-x-4">
        <div>
          <h1 className="text-2xl font-bold">{provider.name}</h1>
          <p className="text-gray-600">{provider.category}</p>
          <p className="text-gray-600">{provider.location}</p>
          <p className="text-yellow-500">
            {provider.averageRating} ⭐ ({provider.totalReviews} reseñas)
          </p>
        </div>
      </div>

      {/* Descripción */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold">Acerca de mí</h2>
        <p className="text-gray-700">{provider.description}</p>
      </div>

      {/* Servicios ofrecidos */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold">Servicios Ofrecidos</h2>
        <ul className="mt-4 space-y-4">
          {provider.services.map((service) => (
            <li key={service.id} className="p-4 border rounded-md shadow-sm">
              <h3 className="text-lg font-bold">{service.name}</h3>
              <p className="text-gray-600">Precio: ${service.price}</p>
              <p className="text-gray-600">Duración: {service.duration} minutos</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Reseñas */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold">Reseñas</h2>
        <ul className="mt-4 space-y-4">
          {reviews.map((review) => (
            <li key={review.id} className="p-4 border rounded-md shadow-sm">
              <p className="text-gray-700">
                <strong>{review.reviewerName}</strong> - {review.stars} ⭐
              </p>
              <p className="text-gray-600">{review.comment}</p>
              <p className="text-gray-400 text-sm">{new Date(review.createdAt).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Botones de acción */}
      <div className="mt-6 flex space-x-4">
        <button className="bg-blue-500 text-white px-4 py-2 rounded-md">Contactar</button>
        <button className="bg-green-500 text-white px-4 py-2 rounded-md">Agendar Servicio</button>
      </div>
    </div>
  );
};

export default ServiceProviderProfile;
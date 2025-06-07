// components/ServiceCard.tsx
import React from 'react'
import { useNavigate } from 'react-router-dom'

interface ServiceCardProps {
  _id: string
  title: string
  description: string
  images: string[]
  video?: string
  categories: string[]
  price: { min: number; max: number }
  averageRating: number
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  _id,
  title,
  description,
  images,
  categories,
  price,
  averageRating
}) => {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(`/service/${_id}`)
  }

  return (
    <div
      className="border rounded-lg shadow p-4 bg-white hover:shadow-md transition duration-200 cursor-pointer"
      onClick={handleClick}
    >
      <img
        src={images[0] || 'https://via.placeholder.com/300'}
        alt={title}
        className="w-full h-40 object-cover rounded mb-2"
      />
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{description}</p>
      <div className="text-sm text-gray-700">
        <p>
          <span className="font-medium">Precio:</span> ${price.min} - $
          {price.max}
        </p>
        <p>
          <span className="font-medium">Categorías:</span>{' '}
          {categories.join(', ')}
        </p>
        <p>
          <span className="font-medium">Rating:</span>{' '}
          {averageRating.toFixed(1)} / 5
        </p>
      </div>
    </div>
  )
}

export default ServiceCard

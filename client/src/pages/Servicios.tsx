import React, { useEffect, useState } from 'react'
import axios from 'axios'
import ServiceCard from '../components/ServiceCard'

interface Service {
  _id: string
  title: string
  description: string
  images: string[]
  video?: string
  categories: string[]
  price: { min: number; max: number }
  averageRating: number
}

const ServiciosPage: React.FC = () => {
  const [services, setServices] = useState<Service[]>([])
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [category, setCategory] = useState('')
  const [minRating, setMinRating] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchServices = React.useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const params: Record<string, string> = {}
      if (minPrice) params.minPrice = minPrice
      if (maxPrice) params.maxPrice = maxPrice
      if (category) params.category = category
      if (minRating) params.minRating = minRating
      if (searchTerm) params.search = searchTerm

      const endpoint =
        Object.keys(params).length > 0
          ? 'https://conectadose7-b5dfgdb2e2fkg2hd.canadacentral-01.azurewebsites.net/api/services/getFilteredServices'
          : 'https://conectadose7-b5dfgdb2e2fkg2hd.canadacentral-01.azurewebsites.net/api/services/getAllServices'

      const response = await axios.get<Service[]>(endpoint, { params })

      if (!response.data) {
        throw new Error('No data received from server')
      }

      setServices(Array.isArray(response.data) ? response.data : [])
    } catch (error) {
      console.error('Error fetching services:', error)
      setError('Failed to load services. Please try again later.')
      setServices([])
    } finally {
      setIsLoading(false)
    }
  }, [minPrice, maxPrice, category, minRating, searchTerm])

  useEffect(() => {
    fetchServices()
  }, [fetchServices])

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    fetchServices()
  }

  return (
    <div className="pattern-bg bg-cover bg-center min-h-[calc(100vh-4rem)] flex items-center justify-center">
      <div className="min-h-[calc(100vh-4rem)] bg-gray-100 pattern-bg bg-cover bg-center ">
        <header className="bg-blue-600 text-white py-4 px-6">
          <h1 className="text-3xl font-bold">Servicios</h1>
        </header>
        <div className="flex">
          {/* Sidebar Filters */}
          <aside className="w-1/4 bg-white p-4 shadow-md">
            <h2 className="text-xl font-bold mb-4">Filtros</h2>
            <form onSubmit={handleFilterSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Buscar servicio..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="p-2 border rounded w-full"
              />
              <input
                type="number"
                placeholder="Precio mínimo"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="p-2 border rounded w-full"
              />
              <input
                type="number"
                placeholder="Precio máximo"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="p-2 border rounded w-full"
              />
              <select
                value={category}
                title="Categoría"
                onChange={(e) => setCategory(e.target.value)}
                className="p-2 border rounded w-full"
              >
                <option value="">Todas las categorías</option>
                <option value="Belleza">Belleza</option>
                <option value="Construcción">Construcción</option>
                <option value="Gasfitería">Gasfitería</option>
                <option value="Jardinería">Jardinería</option>
                <option value="Electricidad">Electricidad</option>
                <option value="Gastronomía">Gastronomía</option>
                <option value="Limpieza">Limpieza</option>
                <option value="Otro">Otro</option>
              </select>
              <input
                type="number"
                placeholder="Rating mínimo"
                value={minRating}
                onChange={(e) => setMinRating(e.target.value)}
                className="p-2 border rounded w-full"
                min={0}
                max={5}
                step={0.1}
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Filtrando...' : 'Filtrar'}
              </button>
            </form>
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-6">
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
                {error}
                <button
                  onClick={fetchServices}
                  className="ml-4 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  Reintentar
                </button>
              </div>
            ) : services.length === 0 ? (
              <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative mb-6">
                No se encontraron servicios. Prueba con otros filtros.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service) => (
                  <ServiceCard key={service._id} {...service} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

export default ServiciosPage

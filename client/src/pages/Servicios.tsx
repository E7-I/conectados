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
  const [isFiltering, setIsFiltering] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)

  const fetchServicesWithFilters = React.useCallback(
    async (
      filters: {
        minPrice?: string
        maxPrice?: string
        category?: string
        minRating?: string
        searchTerm?: string
      },
      isInitialLoad = false
    ) => {
      if (isInitialLoad) {
        setIsLoading(true)
      } else {
        setIsFiltering(true)
      }
      setError(null)
      try {
        const params: Record<string, string> = {}

        if (filters.minPrice) params.minPrice = filters.minPrice
        if (filters.maxPrice) params.maxPrice = filters.maxPrice
        if (filters.category) params.category = filters.category
        if (filters.minRating) params.minRating = filters.minRating
        if (filters.searchTerm) params.search = filters.searchTerm

        const endpoint =
          Object.keys(params).length > 0
            ? 'http://localhost:5000/api/services/getFilteredServices'
            : 'http://localhost:5000/api/services/getAllServices'

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
        if (isInitialLoad) {
          setIsLoading(false)
        } else {
          setIsFiltering(false)
        }
      }
    },
    []
  )

  // Initial load - fetch all services without filters
  useEffect(() => {
    fetchServicesWithFilters({}, true)
  }, [fetchServicesWithFilters])

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    fetchServicesWithFilters(
      { minPrice, maxPrice, category, minRating, searchTerm },
      false
    )
  }

  const handleRetry = () => {
    fetchServicesWithFilters(
      { minPrice, maxPrice, category, minRating, searchTerm },
      false
    )
  }

  const toggleFilters = () => {
    setIsFiltersOpen(!isFiltersOpen)
  }

  const renderFiltersForm = () => (
    <form onSubmit={handleFilterSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Buscar servicio
        </label>
        <input
          type="text"
          placeholder="Buscar servicio..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Precio mín.
          </label>
          <input
            type="number"
            placeholder="0"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Precio máx.
          </label>
          <input
            type="number"
            placeholder="999999"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Categoría
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            title="Seleccionar categoría"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todas</option>
            <option value="Belleza">Belleza</option>
            <option value="Construcción">Construcción</option>
            <option value="Gasfitería">Gasfitería</option>
            <option value="Jardinería">Jardinería</option>
            <option value="Electricidad">Electricidad</option>
            <option value="Gastronomía">Gastronomía</option>
            <option value="Limpieza">Limpieza</option>
            <option value="Otro">Otro</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Rating mínimo
          </label>
          <input
            type="number"
            placeholder="0.0"
            value={minRating}
            onChange={(e) => setMinRating(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            min={0}
            max={5}
            step={0.1}
          />
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200 font-medium"
          disabled={isFiltering}
        >
          {isFiltering ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Filtrando...
            </div>
          ) : (
            'Aplicar Filtros'
          )}
        </button>
        <button
          type="button"
          onClick={() => {
            setSearchTerm('')
            setMinPrice('')
            setMaxPrice('')
            setCategory('')
            setMinRating('')
            fetchServicesWithFilters({}, false)
          }}
          className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors duration-200 font-medium"
        >
          Limpiar Filtros
        </button>
      </div>
    </form>
  )

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Cargando servicios...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">{error}</p>
          <button
            onClick={handleRetry}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="pattern-bg bg-cover bg-center min-h-[calc(100vh-4rem)] p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg mb-6 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-blue-700 px-6 py-4">
            <h1 className="text-white text-2xl font-bold">
              Servicios Disponibles
            </h1>
            <p className="text-blue-100 mt-1">
              Encuentra el servicio que necesitas
            </p>
          </div>
        </div>

        <div className="lg:flex lg:gap-6">
          {/* Desktop Sidebar Filters */}
          <aside className="hidden lg:block lg:w-1/4">
            <div className="sticky top-4">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-gray-500 to-gray-700 px-6 py-4">
                  <h2 className="text-white text-lg font-bold">
                    Filtros de Búsqueda
                  </h2>
                  <p className="text-gray-100 mt-1 text-sm">
                    Refina tu búsqueda de servicios
                  </p>
                </div>
                <div className="p-6">{renderFiltersForm()}</div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:flex-1">
            {/* Mobile Filters */}
            <div className="lg:hidden mb-6">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <button
                  onClick={toggleFilters}
                  className="w-full bg-gradient-to-r from-gray-500 to-gray-700 px-6 py-4 text-left focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  {...(isFiltersOpen ? { 'aria-expanded': 'true' } : { 'aria-expanded': 'false' })}
                  aria-controls="mobile-filters"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-white text-lg font-bold">
                        Filtros de Búsqueda
                      </h2>
                      <p className="text-gray-100 mt-1 text-sm">
                        Refina tu búsqueda de servicios
                      </p>
                    </div>
                    <div className="text-white">
                      <svg
                        className={`w-6 h-6 transform transition-transform duration-200 ${
                          isFiltersOpen ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </button>
                <div
                  id="mobile-filters"
                  className={`transition-all duration-300 ease-in-out ${
                    isFiltersOpen
                      ? 'max-h-[1000px] opacity-100'
                      : 'max-h-0 opacity-0 overflow-hidden'
                  }`}
                >
                  <div className="p-6 border-t border-gray-200">
                    {renderFiltersForm()}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              {/* Main Content Header */}
              <div className="bg-gradient-to-r from-blue-500 to-blue-700 px-6 py-4">
                <h2 className="text-white text-xl font-bold">
                  Explorar Servicios
                </h2>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-2 gap-2">
                  <p className="text-blue-100 text-sm">
                    {services.length > 0
                      ? `${services.length} servicios encontrados`
                      : 'Usa los filtros para buscar servicios'}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {services.filter((s) => s.averageRating >= 4).length}{' '}
                      Destacados
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {services.length} Total
                    </span>
                  </div>
                </div>
              </div>

              {isFiltering ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Aplicando filtros...</p>
                  </div>
                </div>
              ) : services.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-500">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400 mb-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No se encontraron servicios
                    </h3>
                    <p className="text-gray-500">
                      Prueba con otros filtros o términos de búsqueda.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {services.map((service) => (
                      <ServiceCard key={service._id} {...service} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default ServiciosPage

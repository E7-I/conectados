import { useParams } from 'react-router-dom'

const ServiceDetails = () => {
  const { id } = useParams()

  return <h1 className="text-2xl">Detalle del servicio #{id}</h1>
}

export default ServiceDetails

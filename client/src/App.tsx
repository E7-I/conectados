import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Register from './pages/Register'
import ServiceDetails from './pages/ServiceDetails'
import Login from './pages/Login'
//import RequestForm from './pages/RequestForm'
import './index.css'

/*Agregando Appointment page */
import Appointments from './pages/Appointments'

function App() {
  const fakeUser = {
    _id: '1',
    nombre: 'Necesitado 1',
    role: 'professional' as 'professional' | 'client', // cambia a 'client' para simular como cliente
  }
  return (
    <BrowserRouter>
      <Navbar />
      <div className="p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/registro" element={<Register />} />
          <Route path="/servicio/:id" element={<ServiceDetails />} />
          <Route path="/login" element={<Login />} />
          {/* Agregando ruta para citas */}
          <Route path="/citas" element={<Appointments user={fakeUser} />} />
          {/*<Route path="/request" element={<RequestForm clientId={fakeUser._id} professionalId="123" serviceId="456" />} /> */}
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Register from './pages/Register'
import ServiceDetails from './pages/ServiceDetails'
import Login from './pages/Login'
import Servicios from './pages/Servicios'
import Appointments from './pages/Appointments'
import Prestador from './pages/Prestador'
import './index.css'

function App() {
  const fakeUser = {
    _id: '1',
    role: 'client' as 'professional' | 'client', // cambia a 'professional' para simular como profesional (Esto se puede cambiar en el futuro)
    nombre: 'needhelp1',
  }
  return (
    <BrowserRouter>
      <Navbar />
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/registro" element={<Register />} />
          <Route path="/servicio/:id" element={<ServiceDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/Service/:id" element={<ServiceDetails />} />
          <Route path="/servicios" element={<Servicios />} />
          <Route path="/citas" element={<Appointments user={fakeUser} />} />
          <Route path="*" element={<div>404 Not Found</div>} />
          <Route path="/prestador/:professionalid" element={<Prestador />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App

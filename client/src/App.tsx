import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AuthProvider } from './contexts/AuthContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Register from './pages/Register'
import ServiceDetails from './pages/ServiceDetails'
import Login from './pages/Login'
import Servicios from './pages/Servicios'
import Appointments from './pages/Appointments'
import Prestador from './pages/Prestador'
import UserSettings from './pages/UserSettings'
import UserReviews from './pages/UserReviews'
import UserDashboard from './pages/UserDashboard'
import NotFound from './pages/NotFound'
import './index.css'

function App() {
  const fakeUser = {
    _id: '1',
    role: 'client' as 'professional' | 'client', // cambia a 'professional' para simular como profesional (Esto se puede cambiar en el futuro)
    nombre: 'needhelp1',
  }
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/registro" element={<Register />} />
            <Route path="/servicio/:id" element={<ServiceDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/Service/:id" element={<ServiceDetails />} />
            <Route path="/servicios" element={<Servicios />} />
            <Route path="/citas" element={<Appointments user={fakeUser} />} />
            <Route path="/prestador/:professionalid" element={<Prestador />} />
            <Route path="/settings" element={<UserSettings />} />
            <Route path="/dashboard/users" element={<UserDashboard />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/reviews" element={<UserReviews />} />
          </Routes>
        </main>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App

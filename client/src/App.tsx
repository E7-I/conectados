import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Register from './pages/Register'
import ServiceDetails from './pages/ServiceDetails'
import Login from './pages/Login'
import './index.css'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/registro" element={<Register />} />
          <Route path="/servicio/:id" element={<ServiceDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/Service/:id" element={<ServiceDetails />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App

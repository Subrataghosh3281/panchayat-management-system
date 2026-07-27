import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import CitizenLogin from './pages/CitizenLogin'
import CitizenRegister from './pages/CitizenRegister'
import StaffLogin from './pages/StaffLogin'
import AdminLogin from './pages/AdminLogin'
import CitizenDashboard from './pages/CitizenDashboard'
import StaffDashboard from './pages/StaffDashboard'
import AdminDashboard from './pages/AdminDashboard'
import NewComplaint from './pages/NewComplaint'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/citizen-login" element={<CitizenLogin />} />
        <Route path="/citizen-register" element={<CitizenRegister />} />
        <Route path="/staff-login" element={<StaffLogin />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/citizen-dashboard" element={<CitizenDashboard />} />
        <Route path="/staff-dashboard" element={<StaffDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/new-complaint" element={<NewComplaint />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
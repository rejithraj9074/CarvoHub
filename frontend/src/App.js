import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { CssBaseline, Box } from '@mui/material';
import { CustomThemeProvider } from './contexts/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CustomerDashboard from './pages/CustomerDashboard';
import MechanicBooking from './pages/MechanicBooking';
import Profile from './pages/Profile';
import AdminLogin from './pages/AdminLogin';
import MechanicLogin from './pages/MechanicLogin';
import AdminDashboard from './pages/AdminDashboard';
import MechanicDashboard from './pages/MechanicDashboard';
import MechanicOnboarding from './pages/MechanicOnboarding';
import Bookings from './pages/Bookings';
import MechanicChangePassword from './pages/MechanicChangePassword';
import CarWashServices from './pages/CarWashServices';
import CarWashBooking from './pages/CarWashBooking';

function App() {
  const AdminAwareLayout = () => {
    const location = useLocation();
    const isAdminDashboard = location.pathname === '/dashboard/admin';
    return (
      <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          minHeight: '100vh',
          backgroundColor: '#fafafa',
        }}>
          <Navbar />
          <Box component="main" sx={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/customer" element={<CustomerDashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/services/mechanic" element={<MechanicBooking />} />
              <Route path="/services/carwash" element={<CarWashServices />} />
              <Route path="/services/car-wash" element={<CarWashServices />} />
              <Route path="/services/carwash/book" element={<CarWashBooking />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/mechanic/login" element={<MechanicLogin />} />
              <Route path="/dashboard/admin" element={<AdminDashboard />} />
              <Route path="/dashboard/mechanic" element={<MechanicDashboard />} />
              <Route path="/onboarding/mechanic" element={<MechanicOnboarding />} />
              <Route path="/bookings" element={<Bookings />} />
              <Route path="/mechanic/change-password" element={<MechanicChangePassword />} />
            </Routes>
          </Box>
          {!isAdminDashboard && <Footer />}
        </Box>
    );
  };
  return (
    <CustomThemeProvider>
      <CssBaseline />
      <Router>
        <AdminAwareLayout />
      </Router>
    </CustomThemeProvider>
  );
}

export default App;
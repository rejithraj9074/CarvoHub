import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Container, Stack, Paper, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import WelcomeBanner from '../components/dashboard/WelcomeBanner';
import DashboardSidePanel from '../components/dashboard/DashboardSidePanel';
import StatsCards from '../components/dashboard/StatsCards';
import ActiveBookings from '../components/dashboard/ActiveBookings';
import apiClient from '../api/client';
import AppointmentsTimeline from '../components/dashboard/AppointmentsTimeline';
import ServiceShortcuts from '../components/dashboard/ServiceShortcuts';
import NotificationsPanel from '../components/dashboard/NotificationsPanel';
import PaymentsHistory from '../components/dashboard/PaymentsHistory';
import FeedbackCard from '../components/dashboard/FeedbackCard';

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const user = (() => {
    try { return JSON.parse(localStorage.getItem('user')) || null; } catch { return null; }
  })();

  const userName = user?.name || 'Customer';

  const [stats, setStats] = useState({ totalBookings: 0, upcoming: 0, pendingPayments: 0, activeRequests: 0 });
  const [activeBookings, setActiveBookings] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await apiClient.getJson('/api/bookings?limit=50');
        const bookings = res.bookings || [];
        const active = bookings.filter(b => ['pending','confirmed','in_progress','rescheduled'].includes(b.status));
        setActiveBookings(active);
        setStats({
          totalBookings: res.pagination?.totalBookings || bookings.length,
          upcoming: active.length,
          pendingPayments: bookings.filter(b => b.payment?.status === 'pending').length,
          activeRequests: active.length
        });
      } catch (e) {
        // ignore silently for now
      }
    };
    load();
  }, []);

  const appointments = [
    { title: 'Oil Change', date: 'Mar 15, 2025', time: '11:00 AM', location: 'CarvoHub Center A' },
    { title: 'Tire Rotation', date: 'Mar 18, 2025', time: '9:30 AM', location: 'CarvoHub Center B' },
  ];

  const payments = [
    { service: 'Brake Replacement', amount: 150, date: 'Feb 20, 2025', method: 'Credit Card', id: 'INV-00112' },
    { service: 'Car Wash Premium', amount: 20, date: 'Feb 25, 2025', method: 'UPI', id: 'INV-00128' },
  ];

  const notifications = [
    { type: 'booking', title: 'Your mechanic is on the way', time: '2h ago', read: false },
    { type: 'payment', title: 'Invoice INV-00128 paid', time: '1d ago', read: true },
    { type: 'offer', title: '10% off on detailing', time: '3d ago', read: false },
  ];

  const isLoggedIn = Boolean(user);

  if (!isLoggedIn) {
    return (
      <Box sx={{ p: 3, maxWidth: 1000, mx: 'auto' }}>
        <Typography variant="h4" sx={{ mb: 2 }}>Customer Dashboard</Typography>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6">Welcome!</Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
            Please log in to view your bookings, appointments, and services.
          </Typography>
          <Button variant="contained" sx={{ mt: 2 }} onClick={() => (window.location.href = '/login')}>
            Go to Login
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Container sx={{ py: 3 }} maxWidth="lg">
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <DashboardSidePanel notifications={notifications} onNavigate={(p) => navigate(p)} />
          <Typography variant="h4" sx={{ fontWeight: 800 }}>Dashboard</Typography>
        </Stack>
        <NotificationsPanel notifications={notifications} />
      </Stack>

      <Box sx={{ mb: 3 }}>
        <WelcomeBanner userName={userName} onEditProfile={() => navigate('/profile')} />
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 1.5, fontWeight: 700 }}>Services</Typography>
        <ServiceShortcuts />
      </Box>

      <Box sx={{ mb: 3 }}>
        <StatsCards stats={stats} />
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Typography variant="h6" sx={{ mb: 1.5, fontWeight: 700 }}>Active Bookings</Typography>
          <ActiveBookings
            bookings={activeBookings}
            onTrack={(bk) => window.alert(`Tracking booking for ${bk.title}`)}
            onCancel={(bk) => window.alert('Cancel request sent')}
            onReschedule={(bk) => window.alert('Reschedule flow coming soon')}
          />
        </Grid>
        <Grid item xs={12} md={5}>
          <AppointmentsTimeline appointments={appointments} />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ my: 3 }}>
        <Grid item xs={12} md={7}>
          <PaymentsHistory payments={payments} onDownload={(p) => console.log('download', p)} />
        </Grid>
        <Grid item xs={12} md={5}>
          <FeedbackCard onSubmit={(d) => console.log('feedback', d)} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default CustomerDashboard;



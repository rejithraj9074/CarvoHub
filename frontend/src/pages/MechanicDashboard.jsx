import React, { useEffect, useState } from 'react';
import { Box, Grid, Paper, Typography, Chip, Button, Divider, CircularProgress, Stack } from '@mui/material';
import { Assignment as AssignmentIcon, CheckCircle as CheckIcon, PlayArrow as StartIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/client';

const StatusChip = ({ status }) => {
  const colorMap = {
    pending: 'default',
    confirmed: 'info',
    in_progress: 'warning',
    completed: 'success',
    cancelled: 'error',
    rescheduled: 'default'
  };
  return <Chip label={status.replace('_',' ')} color={colorMap[status] || 'default'} size="small" />;
};

const MechanicDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hasProfile, setHasProfile] = useState(false);
  const navigate = useNavigate();

  const load = async () => {
    try {
      // First check if mechanic profile exists
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      if (!user?.id) {
        setError('Please log in first');
        return;
      }

      // Check if mechanic profile exists by trying to get mechanics and finding current user
      const mechanicsRes = await apiClient.getJson('/api/mechanics?limit=100');
      const mechanics = mechanicsRes.mechanics || [];
      const currentMechanic = mechanics.find(m => m.user?._id === user.id || m.user?.id === user.id);
      
      if (!currentMechanic) {
        setError('Mechanic profile not found. Please complete your profile setup.');
        setHasProfile(false);
        return;
      }

      setHasProfile(true);
      
      // Load bookings for this mechanic
      const res = await apiClient.getJson('/api/bookings?limit=50');
      setBookings(res.bookings || []);
    } catch (e) {
      setError(e?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    await apiClient.putJson(`/api/bookings/${id}/status`, { status });
    await load();
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography color="error" variant="h6">{error}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {!hasProfile ? 'Complete your mechanic profile to get started.' : 'Make sure you are logged in as a mechanic.'}
        </Typography>
        {!hasProfile && (
          <Button 
            variant="contained" 
            sx={{ mt: 2 }}
            onClick={() => navigate('/onboarding/mechanic')}
          >
            Complete Profile Setup
          </Button>
        )}
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Typography variant="h4" fontWeight={800} sx={{ mb: 3 }}>Mechanic Jobs</Typography>
      <Grid container spacing={2}>
        {bookings.map((b) => (
          <Grid key={b._id} item xs={12} md={6} lg={4}>
            <Paper elevation={0} sx={{ p: 2 }}>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                <AssignmentIcon color="primary" />
                <Typography variant="h6" fontWeight={700}>{b.serviceType}</Typography>
                <Box sx={{ flex: 1 }} />
                <StatusChip status={b.status} />
              </Stack>
              <Typography variant="body2" color="text.secondary">Customer: {b.customer?.name}</Typography>
              <Typography variant="body2" color="text.secondary">Vehicle: {b.vehicleInfo?.make} {b.vehicleInfo?.model} • {b.vehicleInfo?.year}</Typography>
              <Typography variant="body2" color="text.secondary">Scheduled: {new Date(b.scheduledDate).toLocaleDateString()} {b.scheduledTime}</Typography>
              <Divider sx={{ my: 1.5 }} />
              <Stack direction="row" spacing={1}>
                {b.status === 'confirmed' && (
                  <Button size="small" variant="contained" startIcon={<StartIcon />} onClick={() => updateStatus(b._id, 'in_progress')}>Start</Button>
                )}
                {b.status === 'in_progress' && (
                  <Button size="small" color="success" variant="contained" startIcon={<CheckIcon />} onClick={() => updateStatus(b._id, 'completed')}>Complete</Button>
                )}
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default MechanicDashboard;



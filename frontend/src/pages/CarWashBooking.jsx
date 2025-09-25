import React, { useState } from 'react';
import { Box, Grid, Paper, Typography, TextField, MenuItem, Button, Divider, Snackbar, Alert } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import apiClient from '../api/client';

const SERVICE_TYPES = ['Basic', 'Premium', 'Interior & Exterior', 'Exterior Only', 'Interior Deep Clean'];
const TIME_SLOTS = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00'];

const CarWashBooking = () => {
  const locationState = useLocation().state || {};
  const navigate = useNavigate();
  const [form, setForm] = useState({
    serviceType: locationState.serviceType || '',
    date: '',
    timeSlot: '',
    location: 'workshop',
    carModel: '',
    plateNumber: ''
  });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ open: false, type: 'success', message: '' });

  const submit = async () => {
    try {
      setSaving(true);
      const payload = {
        carDetails: { model: form.carModel, plateNumber: form.plateNumber },
        serviceType: form.serviceType,
        date: form.date,
        timeSlot: form.timeSlot,
        location: form.location
      };
      await apiClient.postJson('/api/carwash', payload);
      setToast({ open: true, type: 'success', message: 'Booking placed successfully' });
      setTimeout(() => navigate('/bookings'), 1200);
    } catch (e) {
      setToast({ open: true, type: 'error', message: e?.message || 'Failed to place booking' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1100, mx: 'auto' }}>
      <Typography variant="h3" fontWeight={800} sx={{ mb: 1 }}>Car Wash Booking</Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>Fill in your details to confirm your wash</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'grey.200' }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField select fullWidth label="Service Type" value={form.serviceType} onChange={(e)=>setForm({ ...form, serviceType: e.target.value })}>
                  {SERVICE_TYPES.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth type="date" label="Date" InputLabelProps={{ shrink: true }} value={form.date} onChange={(e)=>setForm({ ...form, date: e.target.value })} />
              </Grid>
              <Grid item xs={6}>
                <TextField select fullWidth label="Time Slot" value={form.timeSlot} onChange={(e)=>setForm({ ...form, timeSlot: e.target.value })}>
                  {TIME_SLOTS.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField select fullWidth label="Location" value={form.location} onChange={(e)=>setForm({ ...form, location: e.target.value })}>
                  <MenuItem value="workshop">Workshop</MenuItem>
                  <MenuItem value="doorstep">Doorstep</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth label="Car Model" value={form.carModel} onChange={(e)=>setForm({ ...form, carModel: e.target.value })} />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth label="Plate Number" value={form.plateNumber} onChange={(e)=>setForm({ ...form, plateNumber: e.target.value })} />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={12} md={5}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'grey.200' }}>
            <Typography variant="h6" fontWeight={700}>Summary</Typography>
            <Divider sx={{ my: 1 }} />
            <Typography variant="body2">Service: {form.serviceType || '-'}</Typography>
            <Typography variant="body2">Date: {form.date || '-'}</Typography>
            <Typography variant="body2">Time: {form.timeSlot || '-'}</Typography>
            <Typography variant="body2">Location: {form.location}</Typography>
            <Typography variant="body2">Car: {form.carModel || '-'} / {form.plateNumber || '-'}</Typography>
            <Button fullWidth variant="contained" sx={{ mt: 2, py: 1.25, fontWeight: 700, borderRadius: 2 }} disabled={saving} onClick={submit}>Pay & Book</Button>
          </Paper>
        </Grid>
      </Grid>

      <Snackbar open={toast.open} autoHideDuration={2500} onClose={() => setToast({ ...toast, open: false })}>
        <Alert severity={toast.type} onClose={() => setToast({ ...toast, open: false })}>{toast.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default CarWashBooking;



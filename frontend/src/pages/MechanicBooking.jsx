import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  CardHeader,
  TextField,
  MenuItem,
  Button,
  Stack,
  Chip,
  Snackbar,
  Alert,
  ToggleButtonGroup,
  ToggleButton,
  Divider,
} from '@mui/material';
import { Build, Schedule, Place, DirectionsCar, LocalOffer } from '@mui/icons-material';
import apiClient from '../api/client';
import { useNavigate } from 'react-router-dom';

// Map UI service types to backend enum values
const serviceTypes = [
  { value: 'General Maintenance', label: 'General Service' },
  { value: 'Engine Repair', label: 'Engine Diagnostics' },
  { value: 'Brake System', label: 'Brake Service' },
  { value: 'Air Conditioning', label: 'AC Service' },
  { value: 'Battery Services', label: 'Battery Replacement' },
];

const packages = [
  {
    id: 'basic',
    title: 'Basic Care',
    price: 49,
    features: ['General inspection', 'Fluid top-up', '10-point check'],
    badge: 'Popular',
  },
  {
    id: 'standard',
    title: 'Standard Service',
    price: 99,
    features: ['Full inspection', 'Oil change', 'Brake check', '30-point check'],
    highlight: true,
  },
  {
    id: 'premium',
    title: 'Premium Care',
    price: 179,
    features: ['Full diagnostics', 'Synthetic oil', 'AC check', '50-point check'],
  },
];

const MechanicBooking = () => {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    vehicleMake: '',
    vehicleModel: '',
    vehicleYear: '',
    licensePlate: '',
    serviceType: 'General Maintenance',
    preferredDate: '',
    preferredTime: '',
    address: '',
    description: '',
    packageId: 'standard',
    mechanicId: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });
  const [mechanics, setMechanics] = useState([]);
  const navigate = useNavigate();

  const selectedPackage = useMemo(() => packages.find((p) => p.id === form.packageId), [form.packageId]);

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      if (!form.licensePlate) throw new Error('License plate is required');
      if (!form.description) throw new Error('Please describe the issue');

      const selectedSvc = serviceTypes.find(s => s.value === form.serviceType) || serviceTypes[0];
      const pkg = packages.find(p => p.id === form.packageId) || packages[1];
      const estimatedDuration = pkg.id === 'basic' ? 1 : pkg.id === 'standard' ? 2 : 3;
      const estimatedCost = pkg.price;

      const payload = {
        serviceType: selectedSvc.value,
        vehicleInfo: {
          make: form.vehicleMake,
          model: form.vehicleModel,
          year: Number(form.vehicleYear),
          licensePlate: form.licensePlate
        },
        serviceDescription: form.description,
        scheduledDate: form.preferredDate,
        scheduledTime: form.preferredTime,
        estimatedDuration,
        estimatedCost,
        location: {
          type: form.address ? 'customer_location' : 'mechanic_shop',
          address: { street: form.address }
        },
        notes: form.description
      };

      await apiClient.postJson('/api/bookings', payload);
      setSnack({ open: true, message: 'Booking created successfully! Redirecting to your bookings...', severity: 'success' });
      setForm((prev) => ({ ...prev, description: '' }));
      setTimeout(() => navigate('/bookings'), 900);
    } catch (error) {
      setSnack({ open: true, message: 'Something went wrong. Please try again.', severity: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const loadMechanics = async () => {
      try {
        const res = await apiClient.getJson('/api/mechanics?limit=100');
        if (res.mechanics && Array.isArray(res.mechanics)) {
          setMechanics(res.mechanics);
        } else if (Array.isArray(res)) {
          setMechanics(res);
        } else if (res.mechanics && Array.isArray(res.mechanics.mechanics)) {
          setMechanics(res.mechanics.mechanics);
        } else {
          setMechanics([]);
        }
      } catch (e) {
        console.error('Error loading mechanics:', e);
        setMechanics([]);
      }
    };
    loadMechanics();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Hero */}
      <Box sx={{ mb: 3 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ xs: 'flex-start', md: 'center' }}>
          <Box sx={{
            width: 56,
            height: 56,
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #dc2626 0%, #7c2d12 100%)',
            color: '#fff',
          }}>
            <Build />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" sx={{ fontWeight: 800 }}>Book a Mechanic</Typography>
            <Typography variant="body1" color="text.secondary">
              On-demand, reliable service at your doorstep or at our partner workshops.
            </Typography>
          </Box>
        </Stack>
      </Box>

      <Grid container spacing={3}>
        {/* Left: Form */}
        <Grid item xs={12} md={7}>
          <Card elevation={3}>
            <CardHeader
              title="Booking Details"
              subheader={selectedPackage ? `${selectedPackage.title} • $${selectedPackage.price}` : ''}
            />
            <CardContent>
              <Box component="form" onSubmit={handleSubmit}>
                {/* Personal Information */}
                <Typography variant="h6" sx={{ mb: 1.5, fontWeight: 600, color: 'primary.main' }}>
                  Personal Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Full Name"
                      value={form.name}
                      onChange={handleChange('name')}
                      fullWidth
                      required
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Phone Number"
                      value={form.phone}
                      onChange={handleChange('phone')}
                      fullWidth
                      required
                      size="small"
                    />
                  </Grid>
                </Grid>

                {/* Vehicle Information */}
                <Typography variant="h6" sx={{ mb: 1.5, fontWeight: 600, color: 'primary.main' }}>
                  Vehicle Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Make"
                      value={form.vehicleMake}
                      onChange={handleChange('vehicleMake')}
                      fullWidth
                      required
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Model"
                      value={form.vehicleModel}
                      onChange={handleChange('vehicleModel')}
                      fullWidth
                      required
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Year"
                      value={form.vehicleYear}
                      onChange={handleChange('vehicleYear')}
                      fullWidth
                      required
                      size="small"
                      type="number"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="License Plate"
                      value={form.licensePlate}
                      onChange={handleChange('licensePlate')}
                      fullWidth
                      required
                      size="small"
                    />
                  </Grid>
                </Grid>

                 {/* Service Information */}
                <Typography variant="h6" sx={{ mb: 1.5, fontWeight: 600, color: 'primary.main' }}>
                  Service Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      select
                      label="Service Type"
                      value={form.serviceType}
                      onChange={handleChange('serviceType')}
                      fullWidth
                      size="small"
                    >
                      {serviceTypes.map((s) => (
                        <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  
                </Grid>

                {/* Schedule Information */}
                <Typography variant="h6" sx={{ mb: 1.5, fontWeight: 600, color: 'primary.main' }}>
                  Schedule Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      type="date"
                      label="Preferred Date"
                      value={form.preferredDate}
                      onChange={handleChange('preferredDate')}
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      type="time"
                      label="Preferred Time"
                      value={form.preferredTime}
                      onChange={handleChange('preferredTime')}
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Service Address"
                      value={form.address}
                      onChange={handleChange('address')}
                      fullWidth
                      placeholder="Pickup location or workshop preference"
                      size="small"
                    />
                  </Grid>
                </Grid>

                {/* Additional Information */}
                <Typography variant="h6" sx={{ mb: 1.5, fontWeight: 600, color: 'primary.main' }}>
                  Additional Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={12}>
                    <TextField
                      label="Describe the issue"
                      value={form.description}
                      onChange={handleChange('description')}
                      fullWidth
                      multiline
                      minRows={3}
                      placeholder="What seems to be the issue? Please provide as much detail as possible."
                      size="small"
                    />
                  </Grid>
                </Grid>

                {/* Buttons */}
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 2 }}>
                  <Button type="submit" variant="contained" disabled={submitting}>
                    {submitting ? 'Submitting...' : 'Submit Booking'}
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() =>
                      setForm((p) => ({ ...p, name: '', phone: '', description: '' }))
                    }
                  >
                    Clear
                  </Button>
                </Stack>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Right: Packages and Info */}
        <Grid item xs={12} md={5}>
          <Card elevation={3} sx={{ mb: 3 }}>
            <CardHeader title="Service Packages" subheader="Choose what suits you" />
            <CardContent>
              <ToggleButtonGroup
                exclusive
                fullWidth
                color="primary"
                value={form.packageId}
                onChange={(e, val) => { if (val) setForm((p) => ({ ...p, packageId: val })); }}
                sx={{ mb: 2, flexWrap: 'wrap' }}
              >
                {packages.map((p) => (
                  <ToggleButton key={p.id} value={p.id} sx={{ flex: 1, minWidth: 120 }}>
                    {p.title}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>

              <Stack spacing={1.25}>
                {selectedPackage?.features.map((f) => (
                  <Stack key={f} direction="row" spacing={1} alignItems="center">
                    <Chip
                      size="small"
                      color="primary"
                      label={<LocalOffer sx={{ fontSize: 16 }} />}
                      sx={{ color: '#fff' }}
                    />
                    <Typography variant="body2">{f}</Typography>
                  </Stack>
                ))}
              </Stack>
            </CardContent>
          </Card>

          <Card elevation={3}>
            <CardHeader title="Why CarvoHub?" />
            <CardContent>
              <Stack spacing={1.5}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Schedule color="primary" />
                  <Typography variant="body2">Same-day or scheduled visits</Typography>
                </Stack>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Place color="primary" />
                  <Typography variant="body2">At-home service or partner workshops</Typography>
                </Stack>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <DirectionsCar color="primary" />
                  <Typography variant="body2">Genuine parts and transparent pricing</Typography>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Snackbar */}
      <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack((s) => ({ ...s, open: false }))}>
        <Alert
          onClose={() => setSnack((s) => ({ ...s, open: false }))}
          severity={snack.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snack.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default MechanicBooking;

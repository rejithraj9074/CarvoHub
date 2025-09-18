import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Link,
  Alert,
  Divider,
  useTheme,
  useMediaQuery,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Fade,
  Slide,
} from '@mui/material';
import { 
  Lock as LockIcon,
  DirectionsCar as CarIcon,
  Build as BuildIcon,
  LocalGasStation as GasIcon,
  CarRepair as RepairIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import '../styles/Login.css';
import apiClient from '../api/client';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: '',
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);
  const [showErrorSnackbar, setShowErrorSnackbar] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

  // Handle return from Google OAuth: token in query string
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      (async () => {
        try {
          localStorage.setItem('token', token);
          const profile = await apiClient.getJson('/api/auth/profile');
          if (profile?.user) {
            localStorage.setItem('user', JSON.stringify(profile.user));
            const role = profile.user.role;
            if (role === 'admin') navigate('/dashboard/admin');
            else if (role === 'mechanic') navigate('/dashboard/mechanic');
            else navigate('/customer');
          } else {
            navigate('/customer');
          }
        } catch (e) {
          // ignore and stay on login
        }
      })();
    }
  }, [navigate]);

  const handleGoogleSignIn = () => {
    window.location.href = `${API_BASE_URL}/api/auth/google/start`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.role) {
      newErrors.role = 'Please select a user role';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setIsLoading(true);

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      const payload = { email: formData.email, password: formData.password };
      let result;
      // Route to the correct auth endpoint based on selected role
      if (formData.role === 'admin') {
        result = await apiClient.postJson('/api/admin/login', payload);
        if (result?.token) {
          localStorage.setItem('token', result.token);
          localStorage.setItem('user', JSON.stringify(result.admin));
          setSuccessMessage(`Welcome back, ${result.admin.name}! Redirecting to Admin Dashboard...`);
          setShowSuccessSnackbar(true);
          setTimeout(() => {
            navigate('/dashboard/admin');
          }, 1500);
        }
        return;
      }

      // Customer and Mechanic authenticate against the common auth endpoint
      result = await apiClient.postJson('/api/auth/login', payload);
      if (result?.token) {
        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));

        const redirectPath = formData.role === 'mechanic' ? '/dashboard/mechanic' : '/customer';
        const roleLabel = formData.role === 'mechanic' ? 'Mechanic' : 'Customer';

        setSuccessMessage(`Welcome back, ${result.user.name}! Redirecting to ${roleLabel} Dashboard...`);
        setShowSuccessSnackbar(true);
        setTimeout(() => {
          navigate(redirectPath);
        }, 1500);
      }
    } catch (error) {
      setSubmitError(error?.message || 'Login failed. Please try again.');
      setShowErrorSnackbar(true);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <Box className="login-container">
      {/* Left Side - Animated Service Icons */}
      <Box className="login-left-side">
        <Box className="left-hero-image">
          <img
            src="https://images.unsplash.com/photo-1542362567-b07e54358753?q=80&w=1600&auto=format&fit=crop"
            alt="Premium automotive service"
            loading="lazy"
          />
        </Box>
        <Box className="service-icons-container">
          <Typography className="service-title">
            CarvoHub
          </Typography>
          <Typography className="service-subtitle">
            Professional car services at your fingertips. Quality maintenance, repairs, and care for your vehicle.
          </Typography>
          
          <Box className="service-icon">
            <CarIcon />
          </Box>
          <Box className="service-icon">
            <BuildIcon />
          </Box>
          <Box className="service-icon">
            <GasIcon />
          </Box>
          <Box className="service-icon">
            <RepairIcon />
          </Box>
        </Box>
      </Box>

      {/* Right Side - Login Form */}
      <Box className="login-right-side">
        <Box className="login-form-container">
          <Paper elevation={0} className="login-form">
            <Box className="login-header">
              <Box className="login-icon-container">
                <LockIcon className="login-icon" />
              </Box>
              <Typography className="login-title">
                Welcome Back
              </Typography>
              <Typography className="login-subtitle">
                Sign in to your CarvoHub account
              </Typography>
            </Box>

            {submitError && (
              <Alert severity="error" className="alert alert-error">
                {submitError}
              </Alert>
            )}


            <form onSubmit={handleSubmit}>
              <Box className="login-form-fields">
                <Box className="form-field">
                  <label htmlFor="email">Email Address</label>
                  <TextField
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={!!errors.email}
                    helperText={errors.email}
                    fullWidth
                    variant="outlined"
                    size="small"
                  />
                </Box>

                <Box className="form-field">
                  <label htmlFor="password">Password</label>
                  <TextField
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    error={!!errors.password}
                    helperText={errors.password}
                    fullWidth
                    variant="outlined"
                    size="small"
                  />
                </Box>

                <Box className="form-field">
                  <label htmlFor="role">User Role</label>
                  <FormControl fullWidth size="small">
                    <Select
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      error={!!errors.role}
                      displayEmpty
                    >
                      <MenuItem value="" disabled>
                        Select your role
                      </MenuItem>
                      <MenuItem value="customer">Customer</MenuItem>
                      <MenuItem value="mechanic">Mechanic</MenuItem>
                      <MenuItem value="admin">Admin</MenuItem>
                    </Select>
                  </FormControl>
                  {errors.role && (
                    <Typography className="error-message">{errors.role}</Typography>
                  )}
                </Box>
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                className="login-button"
                disabled={Object.keys(errors).length > 0 || isLoading}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>

            <Divider sx={{ my: 2 }}>or</Divider>
            <Button
              fullWidth
              variant="outlined"
              color="primary"
              onClick={handleGoogleSignIn}
              sx={{ mb: 1 }}
            >
              Continue with Google
            </Button>

            <Box className="register-link">
              <Typography variant="body2">
                Don't have an account?{' '}
                <Link component={RouterLink} to="/register">
                  Sign up here
                </Link>
              </Typography>
            </Box>
          </Paper>
        </Box>
      </Box>

      {/* Premium Success Snackbar */}
      <Snackbar
        open={showSuccessSnackbar}
        autoHideDuration={3000}
        onClose={() => setShowSuccessSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        TransitionComponent={Slide}
        TransitionProps={{ direction: 'down' }}
      >
        <Alert
          severity="success"
          icon={<CheckCircleIcon />}
          onClose={() => setShowSuccessSnackbar(false)}
          sx={{
            minWidth: '400px',
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(76, 175, 80, 0.3)',
            background: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
            color: 'white',
            '& .MuiAlert-icon': {
              color: 'white',
              fontSize: '1.5rem',
            },
            '& .MuiAlert-message': {
              fontSize: '1rem',
              fontWeight: 600,
            },
            '& .MuiAlert-action': {
              color: 'white',
            },
          }}
        >
          {successMessage}
        </Alert>
      </Snackbar>

      {/* Premium Error Snackbar */}
      <Snackbar
        open={showErrorSnackbar}
        autoHideDuration={4000}
        onClose={() => setShowErrorSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        TransitionComponent={Slide}
        TransitionProps={{ direction: 'down' }}
      >
        <Alert
          severity="error"
          icon={<ErrorIcon />}
          onClose={() => setShowErrorSnackbar(false)}
          sx={{
            minWidth: '400px',
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(244, 67, 54, 0.3)',
            background: 'linear-gradient(135deg, #f44336 0%, #ef5350 100%)',
            color: 'white',
            '& .MuiAlert-icon': {
              color: 'white',
              fontSize: '1.5rem',
            },
            '& .MuiAlert-message': {
              fontSize: '1rem',
              fontWeight: 600,
            },
            '& .MuiAlert-action': {
              color: 'white',
            },
          }}
        >
          {submitError}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Login;

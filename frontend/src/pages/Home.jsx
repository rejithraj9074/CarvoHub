import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Build as BuildIcon,
  LocalCarWash as CarWashIcon,
  DirectionsCar as CarIcon,
  Settings as PartsIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  const services = [
    {
      title: 'Mechanic Booking',
      description: 'Book certified mechanics for your vehicle maintenance and repairs. Get instant quotes and schedule appointments.',
      icon: BuildIcon,
      color: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
      action: 'Book Now',
      path: '/login',
      image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    },
    {
      title: 'Car Wash Booking',
      description: 'Professional car washing services with flexible scheduling. Keep your vehicle looking its best.',
      icon: CarWashIcon,
      color: 'linear-gradient(135deg, #7c2d12 0%, #451a03 100%)',
      action: 'Book Wash',
      path: '/login',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    },
    {
      title: 'Second-Hand Car Sales',
      description: 'Browse quality used vehicles or list your car for sale. Verified listings with detailed information.',
      icon: CarIcon,
      color: 'linear-gradient(135deg, #991b1b 0%, #7f1d1d 100%)',
      action: 'Browse Cars',
      path: '/login',
      image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    },
    {
      title: 'Spare Parts Purchase',
      description: 'Genuine spare parts for all major brands. Fast delivery and competitive pricing guaranteed.',
      icon: PartsIcon,
      color: 'linear-gradient(135deg, #450a0a 0%, #1c1917 100%)',
      action: 'Shop Parts',
      path: '/login',
      image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    },
  ];

  const handleServiceAction = (path) => {
    navigate(path);
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: 'url("https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        opacity: 0.1,
        zIndex: -1,
      },
    }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #dc2626 0%, #7c2d12 100%)',
          color: 'white',
          py: { xs: 10, md: 16 },
          display: 'flex',
          alignItems: 'center',
          minHeight: '80vh',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            opacity: 0.3,
          },
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                variant="h1"
                component="h1"
                gutterBottom
                sx={{
                  fontWeight: 900,
                  fontSize: { xs: '3rem', md: '4.5rem' },
                  lineHeight: 1.1,
                  background: 'linear-gradient(45deg, #ffffff 30%, #f0f0f0 90%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 3,
                }}
              >
                Welcome to CarvoHub
              </Typography>
              <Typography
                variant="h5"
                component="p"
                paragraph
                sx={{
                  mb: 5,
                  opacity: 0.95,
                  fontSize: { xs: '1.2rem', md: '1.4rem' },
                  lineHeight: 1.6,
                  fontWeight: 400,
                }}
              >
                Your comprehensive automotive service platform. From maintenance to 
                sales, we provide everything you need for your vehicle.
              </Typography>
              <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/register')}
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    color: theme.palette.primary.main,
                    px: 5,
                    py: 2,
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    borderRadius: 4,
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 1)',
                      transform: 'translateY(-3px)',
                      boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
                    },
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                >
                  Get Started
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/login')}
                  sx={{
                    borderColor: 'rgba(255, 255, 255, 0.8)',
                    borderWidth: '2px',
                    color: 'white',
                    px: 5,
                    py: 2,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    borderRadius: 4,
                    backdropFilter: 'blur(10px)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      borderColor: 'white',
                      transform: 'translateY(-3px)',
                      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)',
                    },
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                >
                  Sign In
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100%',
                }}
              >
                <Box
                  sx={{
                    width: { xs: 250, md: 350 },
                    height: { xs: 250, md: 350 },
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(20px)',
                    border: '2px solid rgba(255, 255, 255, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: '-10px',
                      left: '-10px',
                      right: '-10px',
                      bottom: '-10px',
                      borderRadius: '50%',
                      background: 'linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
                      zIndex: -1,
                    },
                  }}
                >
                  <CarIcon
                    sx={{
                      fontSize: { xs: '5rem', md: '7rem' },
                      opacity: 0.9,
                      filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.3))',
                    }}
                  />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Services Section */}
      <Box id="services-section" sx={{ py: { xs: 8, md: 12 }, flex: 1 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography
              variant="h2"
              component="h2"
              gutterBottom
              sx={{
                fontWeight: 800,
                color: theme.palette.grey[800],
                mb: 3,
                background: 'linear-gradient(135deg, #dc2626 0%, #7c2d12 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Our Services
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{
                maxWidth: 600,
                mx: 'auto',
                lineHeight: 1.6,
                opacity: 0.8,
              }}
            >
              Discover our comprehensive range of automotive services designed to keep your vehicle running smoothly
            </Typography>
          </Box>
          
          {/* Services in a single line */}
          <Box sx={{ 
            display: 'flex', 
            gap: 3, 
            overflowX: 'auto',
            pb: 2,
            '&::-webkit-scrollbar': {
              height: 8,
            },
            '&::-webkit-scrollbar-track': {
              background: '#f1f1f1',
              borderRadius: 4,
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#dc2626',
              borderRadius: 4,
              '&:hover': {
                background: '#b91c1c',
              },
            },
          }}>
            {services.map((service, index) => (
              <Card
                key={index}
                sx={{
                  minWidth: 300,
                  height: 'fit-content',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer',
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  '&:hover': {
                    transform: 'translateY(-12px) rotate(1deg)',
                    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
                    '& .MuiCardMedia-root': {
                      transform: 'scale(1.1) rotate(-2deg)',
                    },
                    '& .service-icon': {
                      transform: 'scale(1.2) rotate(5deg)',
                    },
                  },
                }}
                onClick={() => handleServiceAction(service.path)}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={service.image}
                  alt={service.title}
                  sx={{
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'linear-gradient(45deg, rgba(0,0,0,0.3), transparent)',
                      opacity: 0,
                      transition: 'opacity 0.3s ease',
                    },
                    '&:hover::before': {
                      opacity: 1,
                    },
                  }}
                />
                <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 3 }}>
                  <Typography
                    gutterBottom
                    variant="h5"
                    component="h3"
                    sx={{ 
                      fontWeight: 700, 
                      mb: 2,
                      color: theme.palette.grey[800],
                    }}
                  >
                    {service.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ 
                      lineHeight: 1.7,
                      fontSize: '0.95rem',
                    }}
                  >
                    {service.description}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', pb: 3 }}>
                  <Button
                    size="medium"
                    variant="contained"
                    sx={{
                      background: service.color,
                      px: 4,
                      py: 1.5,
                      borderRadius: 3,
                      fontWeight: 600,
                      textTransform: 'none',
                      fontSize: '0.95rem',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {service.action}
                  </Button>
                </CardActions>
              </Card>
            ))}
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;

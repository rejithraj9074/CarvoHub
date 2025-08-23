import React from 'react';
import {
  Box,
  Container,
  Typography,
  IconButton,
  Grid,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Facebook,
  Twitter,
  LinkedIn,
  GitHub,
  Email,
  Phone,
} from '@mui/icons-material';

const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const socialLinks = [
    { icon: Facebook, url: 'https://facebook.com', label: 'Facebook', color: '#1877f2' },
    { icon: Twitter, url: 'https://twitter.com', label: 'Twitter', color: '#1da1f2' },
    { icon: LinkedIn, url: 'https://linkedin.com', label: 'LinkedIn', color: '#0077b5' },
    { icon: GitHub, url: 'https://github.com', label: 'GitHub', color: '#333' },
  ];

  const contactInfo = [
    { icon: Email, text: 'info@carvohub.com', url: 'mailto:info@carvohub.com' },
    { icon: Phone, text: '+1 (555) 123-4567', url: 'tel:+15551234567' },
  ];

  return (
    <Box
      component="footer"
      sx={{
        background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
        color: 'white',
        py: 8,
        mt: 'auto',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23dc2626" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          opacity: 0.3,
        },
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={6}>
          {/* Project Info */}
          <Grid item xs={12} md={4}>
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Typography 
                variant="h4" 
                component="h2" 
                gutterBottom
                sx={{
                  fontWeight: 800,
                  background: 'linear-gradient(45deg, #dc2626 30%, #7c2d12 90%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 3,
                }}
              >
                CarvoHub
              </Typography>
              <Typography 
                variant="body1" 
                color="grey.300" 
                paragraph
                sx={{ 
                  lineHeight: 1.8,
                  fontSize: '1.05rem',
                  opacity: 0.9,
                }}
              >
                Your one-stop destination for all automotive services. From mechanic 
                booking to car sales, we've got you covered with quality and reliability.
              </Typography>
            </Box>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} md={4}>
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Typography 
                variant="h5" 
                component="h3" 
                gutterBottom
                sx={{ 
                  fontWeight: 700,
                  mb: 3,
                  color: 'white',
                }}
              >
                Contact Us
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {contactInfo.map((contact, index) => (
                  <Box
                    key={index}
                    component="a"
                    href={contact.url}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      color: 'inherit',
                      textDecoration: 'none',
                      p: 2,
                      borderRadius: 2,
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        transform: 'translateX(8px)',
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #dc2626 0%, #7c2d12 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <contact.icon sx={{ fontSize: 20, color: 'white' }} />
                    </Box>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {contact.text}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Grid>

          {/* Social Media */}
          <Grid item xs={12} md={4}>
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Typography 
                variant="h5" 
                component="h3" 
                gutterBottom
                sx={{ 
                  fontWeight: 700,
                  mb: 3,
                  color: 'white',
                }}
              >
                Follow Us
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                {socialLinks.map((social, index) => (
                  <IconButton
                    key={index}
                    component="a"
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    sx={{
                      width: 56,
                      height: 56,
                      color: 'white',
                      background: `linear-gradient(135deg, ${social.color} 0%, ${social.color}dd 100%)`,
                      border: '2px solid rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        transform: 'translateY(-4px) rotate(5deg)',
                        boxShadow: `0 12px 25px ${social.color}40`,
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                      },
                    }}
                  >
                    <social.icon sx={{ fontSize: 24 }} />
                  </IconButton>
                ))}
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Copyright */}
        <Box
          sx={{
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            mt: 6,
            pt: 4,
            textAlign: 'center',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <Typography 
            variant="body2" 
            color="grey.400"
            sx={{
              opacity: 0.8,
              fontSize: '0.95rem',
            }}
          >
            © {new Date().getFullYear()} CarvoHub. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;

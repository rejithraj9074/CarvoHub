import React from 'react';
import { Avatar, Box, Button, Stack, Typography } from '@mui/material';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const WelcomeBanner = ({ userName = 'Customer', onEditProfile }) => {
  return (
    <MotionBox
      sx={{
        p: 3,
        borderRadius: 3,
        background: 'linear-gradient(135deg, #fee2e2 0%, #fff 60%)',
        border: '1px solid #fde68a22',
      }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems={{ xs: 'flex-start', sm: 'center' }}>
        <Avatar sx={{ width: 64, height: 64, bgcolor: 'primary.main', fontWeight: 700 }}>
          {userName?.[0]?.toUpperCase() || 'C'}
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>Welcome back, {userName}!</Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Manage your bookings, payments, and appointments all in one place.
          </Typography>
        </Box>
        <Button variant="contained" color="primary" onClick={onEditProfile}>Edit Profile</Button>
      </Stack>
    </MotionBox>
  );
};

export default WelcomeBanner;



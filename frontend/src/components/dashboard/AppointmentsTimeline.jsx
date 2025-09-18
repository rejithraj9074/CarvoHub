import React from 'react';
import { Card, CardContent, Typography, Stack, Box } from '@mui/material';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const AppointmentsTimeline = ({ appointments = [] }) => {
  return (
    <Card sx={{ borderRadius: 3 }} elevation={2}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>Upcoming Appointments</Typography>
        <Stack spacing={2}>
          {appointments.map((ap, idx) => (
            <MotionBox
              key={idx}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
            >
              <Box sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: 'primary.main',
                boxShadow: '0 0 0 3px rgba(220,38,38,0.15)'
              }} />
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{ap.title}</Typography>
                <Typography variant="body2" color="text.secondary">{ap.date} • {ap.time} • {ap.location}</Typography>
              </Box>
            </MotionBox>
          ))}
          {appointments.length === 0 && (
            <Typography variant="body2" color="text.secondary">No upcoming appointments.</Typography>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default AppointmentsTimeline;



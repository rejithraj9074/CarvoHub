import React from 'react';
import { Card, CardContent, Typography, Chip, Stack, Button, Box, Grid, Divider } from '@mui/material';
import { motion } from 'framer-motion';

const MotionCard = motion(Card);

const statusColor = {
  pending: 'warning',
  confirmed: 'info',
  in_progress: 'info',
  completed: 'success',
  cancelled: 'error',
  rescheduled: 'default',
};

const ActiveBookings = ({ bookings = [], onTrack, onCancel, onReschedule }) => {
  return (
    <Grid container spacing={2}>
      {bookings.map((bk, idx) => {
        const dateLabel = bk.scheduledDate ? new Date(bk.scheduledDate).toLocaleDateString() : bk.date;
        const timeLabel = bk.scheduledTime || bk.time;
        const vehicle = bk.vehicleInfo ? `${bk.vehicleInfo.make || ''} ${bk.vehicleInfo.model || ''}`.trim() : undefined;
        const location = bk.location?.address?.street || undefined;
        const title = bk.serviceType || bk.title || 'Service Booking';
        const status = bk.status || 'pending';
        return (
        <Grid key={idx} item xs={12} md={6}>
          <MotionCard
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            elevation={2}
            sx={{ borderRadius: 3 }}
          >
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">{title}</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>{vehicle || 'Vehicle Service'}</Typography>
                  <Typography variant="body2" color="text.secondary">{dateLabel}{timeLabel ? ` • ${timeLabel}` : ''}</Typography>
                  {location && (
                    <Typography variant="body2" color="text.secondary">{location}</Typography>
                  )}
                </Box>
                <Chip label={status.replace('_',' ')} color={statusColor[status] || 'default'} variant="filled" />
              </Stack>
              <Divider sx={{ my: 1.5 }} />
              <Stack direction="row" spacing={1.5} sx={{ mt: 2 }}>
                <Button size="small" variant="outlined" onClick={() => onTrack?.(bk)}>Track</Button>
                <Button size="small" variant="outlined" color="warning" onClick={() => onReschedule?.(bk)}>Reschedule</Button>
                <Button size="small" variant="contained" color="error" onClick={() => onCancel?.(bk)}>Cancel</Button>
              </Stack>
            </CardContent>
          </MotionCard>
        </Grid>
        );
      })}
      {bookings.length === 0 && (
        <Grid item xs={12}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="body1">No active bookings at the moment.</Typography>
            </CardContent>
          </Card>
        </Grid>
      )}
    </Grid>
  );
};

export default ActiveBookings;



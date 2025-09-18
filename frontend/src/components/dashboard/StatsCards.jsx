import React from 'react';
import { Grid, Card, CardContent, Stack, Typography, Box } from '@mui/material';
import { Assignment, Event, Payment, BuildCircle } from '@mui/icons-material';
import { motion } from 'framer-motion';

const MotionCard = motion(Card);

const statItems = [
  { label: 'Total Bookings', valueKey: 'totalBookings', icon: Assignment, color: '#dc2626' },
  { label: 'Upcoming Appointments', valueKey: 'upcoming', icon: Event, color: '#7c2d12' },
  { label: 'Pending Payments', valueKey: 'pendingPayments', icon: Payment, color: '#b91c1c' },
  { label: 'Active Requests', valueKey: 'activeRequests', icon: BuildCircle, color: '#ef4444' },
];

const StatsCards = ({ stats = {} }) => {
  return (
    <Grid container spacing={2}>
      {statItems.map((item, index) => {
        const Icon = item.icon;
        const value = stats[item.valueKey] ?? 0;
        return (
          <Grid key={item.label} item xs={12} sm={6} md={3}>
            <MotionCard
              whileHover={{ y: -6, scale: 1.01 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              sx={{ borderRadius: 3 }}
              elevation={3}
            >
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: `${item.color}22`,
                    border: `1px solid ${item.color}33`,
                  }}>
                    <Icon sx={{ color: item.color }} />
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>{value}</Typography>
                    <Typography variant="body2" color="text.secondary">{item.label}</Typography>
                  </Box>
                </Stack>
              </CardContent>
            </MotionCard>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default StatsCards;



import React from 'react';
import { Grid, Card, CardActionArea, CardContent, CardActions, Stack, Typography, Box, Button } from '@mui/material';
import { Build, LocalCarWash, ShoppingCart, DirectionsCar } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const MotionCard = motion(Card);

const shortcuts = [
  { title: 'Book Mechanic', icon: Build, path: '/services/mechanic', color: '#dc2626' },
  { title: 'Book Car Wash', icon: LocalCarWash, path: '/services/car-wash', color: '#7c2d12' },
  { title: 'Accessory Shopping', icon: ShoppingCart, path: '/accessories', color: '#ef4444' },
  { title: 'Browse Second-Hand Cars', icon: DirectionsCar, path: '/marketplace/cars', color: '#b91c1c' },
];

const ServiceShortcuts = () => {
  const navigate = useNavigate();

  return (
    <Grid container spacing={2}>
      {shortcuts.map((s) => {
        const Icon = s.icon;
        return (
          <Grid key={s.title} item xs={12} sm={6} md={3}>
            <MotionCard
              whileHover={{ y: -6 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              elevation={3}
              sx={{
                borderRadius: 3,
                minWidth: 280,
                maxWidth: 320,
                mx: 'auto',
                display: 'flex',
                flexDirection: 'column',
                border: '1px solid #e5e7eb',
              }}
            >
              <CardActionArea onClick={() => navigate(s.path)}>
                <CardContent sx={{ p: 3 }}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box sx={{
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: '#000',
                      color: '#fff',
                      boxShadow: '0 8px 20px rgba(0,0,0,0.15)'
                    }}>
                      <Icon />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>{s.title}</Typography>
                  </Stack>
                </CardContent>
              </CardActionArea>
              <CardActions sx={{ px: 3, pb: 3, pt: 0, mt: 'auto' }}>
                <Button fullWidth variant="contained" sx={{
                  backgroundColor: '#000',
                  color: '#fff',
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 700,
                  '&:hover': { backgroundColor: '#333' }
                }} onClick={() => navigate(s.path)}>
                  Explore
                </Button>
              </CardActions>
            </MotionCard>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default ServiceShortcuts;



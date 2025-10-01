import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Card, CardContent, Chip, Grid } from '@mui/material';
import { getJson } from '../api/client';

const statusColor = (status) => {
  switch ((status || '').toLowerCase()) {
    case 'pending': return 'warning';
    case 'shipped': return 'info';
    case 'delivered': return 'success';
    case 'cancelled': return 'error';
    default: return 'default';
  }
};

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const userRaw = localStorage.getItem('user');
        const user = userRaw ? JSON.parse(userRaw) : {};
        
        // Check if user is logged in and has a valid ID
        if (!user?._id) {
          setError('Please log in to view your orders');
          setLoading(false);
          return;
        }
        
        const data = await getJson(`/api/orders/${user._id}`);
        if (!active) return;
        setOrders(Array.isArray(data) ? data : (Array.isArray(data?.orders) ? data.orders : []));
      } catch (e) {
        setError(e?.message || 'Failed to load orders');
      } finally {
        setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="lg">
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 3 }}>My Orders</Typography>
        {loading ? (
          <Typography>Loading...</Typography>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : orders.length === 0 ? (
          <Typography>No orders yet.</Typography>
        ) : (
          <Grid container spacing={2}>
            {orders.map((order) => (
              <Grid key={order._id} item xs={12}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Order #{order._id?.slice(-6)}</Typography>
                      <Chip label={order.status || 'Pending'} color={statusColor(order.status)} />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">Items: {Array.isArray(order.items) ? order.items.reduce((sum, it) => sum + (it.quantity || 1), 0) : 0}</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>Total: ₹{Number(order.amount || 0).toFixed(2)}</Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default MyOrders;



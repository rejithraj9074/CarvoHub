import React, { useState } from 'react';
import { Box, Container, Grid, Card, CardContent, Typography, TextField, Button } from '@mui/material';
import { useCart } from '../contexts/CartContext';
import { postJson } from '../api/client';
import { useNavigate } from 'react-router-dom';

const CheckoutPage = () => {
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', phone: '', address: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const placeOrder = async () => {
    setError('');
    if (!form.name || !form.phone || !form.address) {
      setError('Please fill all fields');
      return;
    }
    if (items.length === 0) {
      setError('Cart is empty');
      return;
    }
    setLoading(true);
    try {
      const userRaw = localStorage.getItem('user');
      const user = userRaw ? JSON.parse(userRaw) : {};
      await postJson('/api/orders', {
        userId: user?._id,
        items: items.map(({ _id, quantity }) => ({ itemId: _id, quantity })),
        address: form.address,
        phone: form.phone,
        amount: subtotal,
      });
      clearCart();
      navigate('/my-orders');
    } catch (e) {
      setError(e?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="lg">
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 3 }}>Checkout</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={7}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Delivery Details</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="Full Name" value={form.name} onChange={handleChange('name')} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="Phone" value={form.phone} onChange={handleChange('phone')} />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth label="Address" multiline minRows={3} value={form.address} onChange={handleChange('address')} />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={5}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Order Summary</Typography>
                {items.map((it) => (
                  <Box key={it._id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">{it.name} x {it.quantity}</Typography>
                    <Typography variant="body2">₹{(Number(it.price || 0) * it.quantity).toFixed(2)}</Typography>
                  </Box>
                ))}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                  <Typography sx={{ fontWeight: 700 }}>Total</Typography>
                  <Typography sx={{ fontWeight: 800 }}>₹{subtotal.toFixed(2)}</Typography>
                </Box>
                {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
                <Button fullWidth sx={{ mt: 2 }} variant="contained" disabled={loading} onClick={placeOrder}>
                  {loading ? 'Placing Order...' : 'Place Order'}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default CheckoutPage;



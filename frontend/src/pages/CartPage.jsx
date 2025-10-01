import React from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, CardMedia, IconButton, TextField, Button } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
  const { items, subtotal, updateQuantity, removeItem } = useCart();
  const navigate = useNavigate();

  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="lg">
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 3 }}>Your Cart</Typography>
        {items.length === 0 ? (
          <Typography>Your cart is empty.</Typography>
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Grid container spacing={2}>
                {items.map((item) => (
                  <Grid key={item._id} item xs={12}>
                    <Card>
                      <Box sx={{ display: 'flex', alignItems: 'stretch' }}>
                        {item.imageUrl && (
                          <CardMedia component="img" image={item.imageUrl} alt={item.name} sx={{ width: 140, height: 140, objectFit: 'cover' }} />
                        )}
                        <CardContent sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'space-between' }}>
                          <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{item.name}</Typography>
                            <Typography variant="body2" color="text.secondary">₹{Number(item.price || 0).toFixed(2)}</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <TextField
                              type="number"
                              size="small"
                              inputProps={{ min: 1 }}
                              value={item.quantity}
                              onChange={(e) => updateQuantity(item._id, Number(e.target.value))}
                              sx={{ width: 90 }}
                            />
                            <IconButton color="error" onClick={() => removeItem(item._id)}>
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        </CardContent>
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>Order Summary</Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography>Subtotal</Typography>
                    <Typography sx={{ fontWeight: 700 }}>₹{subtotal.toFixed(2)}</Typography>
                  </Box>
                  <Button fullWidth variant="contained" onClick={() => navigate('/checkout')}>Proceed to Checkout</Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default CartPage;



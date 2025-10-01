import React, { useEffect, useState } from 'react';
import { Box, Container, Grid, Card, CardContent, CardMedia, Typography, Button, CardActions, TextField, InputAdornment, IconButton } from '@mui/material';
import { Search as SearchIcon, ShoppingCart as ShoppingCartIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { getJson } from '../api/client';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';

const AccessoriesPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const { addItem } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await getJson('/api/items');
        if (!active) return;
        setItems(Array.isArray(data) ? data : (Array.isArray(data?.items) ? data.items : []));
      } catch (e) {
        setError(e?.message || 'Failed to load accessories');
      } finally {
        setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  const filtered = items.filter((it) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return [it.name, it.description, it.category].filter(Boolean).some((t) => String(t).toLowerCase().includes(q));
  });

  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton 
            onClick={() => navigate(-1)}
            sx={{ 
              mr: 2, 
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.08)',
              }
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>Car Accessories</Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', mb: 3, gap: 2, flexWrap: 'wrap' }}>
          <TextField
            placeholder="Search accessories"
            size="small"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            sx={{ minWidth: 280 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {loading ? (
          <Typography>Loading...</Typography>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <Grid container spacing={3}>
            {filtered.map((item) => (
              <Grid key={item._id} item xs={12} sm={6} md={4} lg={3}>
                <Card>
                  {item.imageUrl && (
                    <CardMedia component="img" image={item.imageUrl} alt={item.name} height="180" loading="lazy" />
                  )}
                  <CardContent>
                    <Typography variant="h6" gutterBottom>{item.name}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ minHeight: 48 }}>
                      {item.description || 'Quality accessory for your car.'}
                    </Typography>
                    <Typography variant="subtitle1" sx={{ mt: 1, fontWeight: 700 }}>
                      ₹{Number(item.price || 0).toFixed(2)}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ px: 2, pb: 2 }}>
                    <Button fullWidth variant="contained" startIcon={<ShoppingCartIcon />} onClick={() => addItem(item)}>
                      Add to Cart
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default AccessoriesPage;



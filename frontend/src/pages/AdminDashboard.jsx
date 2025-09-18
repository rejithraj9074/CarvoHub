import React, { useEffect, useState } from 'react';
import { Box, Grid, Paper, Typography, CircularProgress, Divider, TextField, MenuItem, Button, Snackbar, Alert, Slide, Drawer, List, ListItem, ListItemText, ListItemButton } from '@mui/material';
import { People as PeopleIcon, Build as BuildIcon, Assignment as AssignmentIcon } from '@mui/icons-material';
import apiClient from '../api/client';

const StatCard = ({ icon: Icon, label, value, color }) => (
  <Paper elevation={0} sx={{ p: 3 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Box sx={{ width: 48, height: 48, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: color, color: '#fff' }}>
        <Icon />
      </Box>
      <Box>
        <Typography variant="body2" color="text.secondary">{label}</Typography>
        <Typography variant="h5" fontWeight={700}>{value}</Typography>
      </Box>
    </Box>
  </Paper>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookings, setBookings] = useState([]);
  const [mechanics, setMechanics] = useState([]);
  const [assigning, setAssigning] = useState(false);
  const [toast, setToast] = useState({ open: false, type: 'success', message: '' });
  const [activeSection, setActiveSection] = useState('overview');
  const [users, setUsers] = useState([]);

useEffect(() => {
  const loadAll = async () => {
    try {
      const [overview, bookingsRes, mechanicsRes, usersRes] = await Promise.all([
        apiClient.getJson('/api/admin/overview'),
        apiClient.getJson('/api/bookings?limit=50'),
        apiClient.getJson('/api/mechanics'),
        apiClient.getJson('/api/admin/users')
      ]);
      setStats(overview.stats);
      setBookings(bookingsRes.bookings || []);
      // Normalize mechanics response shape
      const mechList = (mechanicsRes && Array.isArray(mechanicsRes.mechanics))
        ? mechanicsRes.mechanics
        : (Array.isArray(mechanicsRes) ? mechanicsRes : (mechanicsRes?.mechanics?.mechanics || []));
      setMechanics(mechList);
      setUsers(usersRes.users || []);
    } catch (e) {
      setError(e?.message || 'Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };
  loadAll();
}, []);

if (loading) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <CircularProgress />
    </Box>
  );
}

if (error) {
  return (
    <Box sx={{ textAlign: 'center', py: 8 }}>
      <Typography color="error" variant="h6">{error}</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        Make sure you are logged in as an admin.
      </Typography>
    </Box>
  );
}

return (
  <Box sx={{ display: 'flex' }}>
    <Drawer variant="permanent" sx={{ width: 240, flexShrink: 0, '& .MuiDrawer-paper': { width: 240, boxSizing: 'border-box', p: 1 } }}>
      <Typography variant="h6" sx={{ px: 2, py: 2, fontWeight: 800 }}>Admin</Typography>
      <Divider />
      <List>
        {[
          {key:'overview',label:'Overview'},
          {key:'users',label:'Users'},
          {key:'bookings',label:'Bookings'},
          {key:'mechanic_mgmt',label:'Mechanic Management'},
          {key:'carwash_mgmt',label:'Car Wash Management'},
          {key:'spares_inventory',label:'Spare Parts Inventory'},
          {key:'cars_sales',label:'2nd-hand Car Sales'}
        ].map(item => (
          <ListItem key={item.key} disablePadding>
            <ListItemButton selected={activeSection===item.key} onClick={()=>setActiveSection(item.key)}>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>

    <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 4 } }}>
      <Typography variant="h4" fontWeight={800} sx={{ mb: 3 }}>Admin Dashboard</Typography>

      {activeSection === 'overview' && (
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <StatCard icon={PeopleIcon} label="Total Users" value={stats?.users ?? 0} color="#dc2626" />
          </Grid>
          <Grid item xs={12} md={4}>
            <StatCard icon={BuildIcon} label="Total Mechanics" value={stats?.mechanics ?? 0} color="#7c2d12" />
          </Grid>
          <Grid item xs={12} md={4}>
            <StatCard icon={AssignmentIcon} label="Total Bookings" value={stats?.bookings ?? 0} color="#6b7280" />
          </Grid>
        </Grid>
      )}

      {activeSection === 'users' && (
        <Paper elevation={0} sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Users</Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            {users.map(u => (
              <Grid key={u._id} item xs={12} md={6}>
                <Paper elevation={0} sx={{ p: 2 }}>
                  <Typography variant="subtitle1" fontWeight={700}>{u.name}</Typography>
                  <Typography variant="body2" color="text.secondary">{u.email}</Typography>
                  <Typography variant="body2" color="text.secondary">{u.phone || 'No phone'}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}

      {activeSection === 'bookings' && (
        <Paper elevation={0} sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" fontWeight={700}>Manage Bookings</Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            {bookings.map((b) => (
              <Grid key={b._id} item xs={12} md={6}>
                <Paper elevation={0} sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                    <AssignmentIcon color="primary" />
                    <Typography variant="subtitle1" fontWeight={700}>{b.serviceType}</Typography>
                    <Box sx={{ flex: 1 }} />
                    <Typography variant="caption" color="text.secondary">{new Date(b.scheduledDate).toLocaleDateString()} {b.scheduledTime}</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">Customer: {b.customer?.name}</Typography>
                  <Typography variant="body2" color="text.secondary">Vehicle: {b.vehicleInfo?.make} {b.vehicleInfo?.model}</Typography>
                  <Typography variant="body2" color="text.secondary">Status: {b.status?.replace('_',' ')}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                    <TextField
                      select
                      size="small"
                      label="Assign Mechanic"
                      value={b.mechanic?._id || ''}
                      onChange={async (e) => {
                        try {
                          await apiClient.putJson(`/api/bookings/${b._id}/assign`, { mechanicId: e.target.value, status: 'confirmed' });
                          const bookingsRes = await apiClient.getJson('/api/bookings?limit=50');
                          setBookings(bookingsRes.bookings || []);
                          setToast({ open: true, type: 'success', message: 'Assigned successfully' });
                        } catch (er) {
                          setToast({ open: true, type: 'error', message: er?.message || 'Assign failed' });
                        }
                      }}
                      disabled={assigning}
                      sx={{ minWidth: 220 }}
                    >
                      <MenuItem value="">Select mechanic...</MenuItem>
                      {mechanics.map((m) => (
                        <MenuItem key={m._id} value={m._id}>{m.user?.name} ({(m.specialization||[])[0] || 'General'})</MenuItem>
                      ))}
                    </TextField>
                    <Button
                      size="small"
                      variant="outlined"
                      color="success"
                      onClick={async () => {
                        try {
                          await apiClient.putJson(`/api/bookings/${b._id}/status`, { status: 'confirmed' });
                          const bookingsRes = await apiClient.getJson('/api/bookings?limit=50');
                          setBookings(bookingsRes.bookings || []);
                          setToast({ open: true, type: 'success', message: 'Booking approved' });
                        } catch (er) {
                          setToast({ open: true, type: 'error', message: er?.message || 'Approve failed' });
                        }
                      }}
                    >
                      Approve
                    </Button>
                    {b.mechanic?.user?.name && (
                      <Button size="small" disabled variant="outlined">{b.mechanic.user.name}</Button>
                    )}
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}

      {activeSection === 'mechanic_mgmt' && (
        <Paper elevation={0} sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Mechanic Management</Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="body2" color="text.secondary">Create mechanic accounts, view profiles, and manage status. (Coming next: full UI)</Typography>
        </Paper>
      )}

      {activeSection === 'carwash_mgmt' && (
        <Paper elevation={0} sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Car Wash Management</Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="body2" color="text.secondary">Approve wash bookings, manage slots and partners. (Coming next: full UI)</Typography>
        </Paper>
      )}

      {activeSection === 'spares_inventory' && (
        <Paper elevation={0} sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Spare Parts Inventory</Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="body2" color="text.secondary">Manage products, stock levels, and pricing. (Coming next: full UI)</Typography>
        </Paper>
      )}

      {activeSection === 'cars_sales' && (
        <Paper elevation={0} sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Second-hand Car Sales</Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="body2" color="text.secondary">Manage listings, approvals, and inquiries. (Coming next: full UI)</Typography>
        </Paper>
      )}

      <Snackbar open={toast.open} autoHideDuration={3000} onClose={() => setToast({ ...toast, open: false })} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} TransitionComponent={Slide} TransitionProps={{ direction: 'down' }}>
        <Alert severity={toast.type} onClose={() => setToast({ ...toast, open: false })}>{toast.message}</Alert>
      </Snackbar>
    </Box>
  </Box>
);
};

export default AdminDashboard;
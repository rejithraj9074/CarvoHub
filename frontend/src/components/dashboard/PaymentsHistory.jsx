import React from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemText, Button, Stack } from '@mui/material';

const PaymentsHistory = ({ payments = [], onDownload }) => {
  return (
    <Card sx={{ borderRadius: 3 }} elevation={2}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>Payment History & Invoices</Typography>
        <List>
          {payments.map((p, idx) => (
            <ListItem key={idx} divider secondaryAction={
              <Stack direction="row" spacing={1}>
                <Button size="small" variant="outlined" onClick={() => onDownload?.(p)}>Download</Button>
              </Stack>
            }>
              <ListItemText primary={`${p.service} • $${p.amount}`} secondary={`${p.date} • ${p.method}`} />
            </ListItem>
          ))}
          {payments.length === 0 && (
            <Typography variant="body2" color="text.secondary">No payments found.</Typography>
          )}
        </List>
      </CardContent>
    </Card>
  );
};

export default PaymentsHistory;



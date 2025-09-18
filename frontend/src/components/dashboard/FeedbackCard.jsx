import React, { useState } from 'react';
import { Card, CardContent, Typography, Rating, TextField, Button, Stack } from '@mui/material';

const FeedbackCard = ({ onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');

  const handleSubmit = () => {
    onSubmit?.({ rating, review });
    setRating(0);
    setReview('');
  };

  return (
    <Card sx={{ borderRadius: 3 }} elevation={2}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>Feedback</Typography>
        <Stack spacing={2}>
          <Rating value={rating} onChange={(_, v) => setRating(v)} />
          <TextField
            multiline
            minRows={3}
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Share your experience with our service"
          />
          <Button variant="contained" onClick={handleSubmit} disabled={!rating || !review.trim()}>Submit</Button>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default FeedbackCard;



import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  createCarWashBooking,
  listCarWashBookings,
  getCarWashBookingById,
  updateCarWashBookingStatus,
  assignCarWashStaff,
  markCarWashPayment
} from '../controllers/carWashController.js';

const router = express.Router();

router.use(protect);

// Customer create & view
router.post('/', createCarWashBooking);
router.get('/', listCarWashBookings);
router.get('/:id', getCarWashBookingById);

// Admin actions
router.put('/:id/status', updateCarWashBookingStatus);
router.put('/:id/assign', assignCarWashStaff);
router.put('/:id/payment', markCarWashPayment);

export default router;



import CarWashBooking from "../models/CarWashBooking.js";

export const createCarWashBooking = async (req, res) => {
  try {
    const { carDetails, serviceType, date, timeSlot, location } = req.body;
    if (!carDetails?.model || !carDetails?.plateNumber || !serviceType || !date || !timeSlot || !location) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }
    const booking = await CarWashBooking.create({
      customerId: req.user.id,
      carDetails,
      serviceType,
      date: new Date(date),
      timeSlot,
      location,
      status: 'Pending',
      paymentStatus: 'Unpaid'
    });
    return res.status(201).json({ message: 'Car wash booking created', booking });
  } catch (e) {
    console.error('createCarWashBooking error:', e);
    return res.status(500).json({ message: 'Server error', error: e.message });
  }
};

export const listCarWashBookings = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, startDate, endDate, customerId } = req.query;
    const query = {};
    if (status) query.status = status;
    if (customerId) query.customerId = customerId;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    // Restrict for non-admins
    if (req.user.role !== 'admin') {
      query.customerId = req.user.id;
    }
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      populate: [
        { path: 'customerId', select: 'name email phone' },
        { path: 'assignedStaffId', select: 'name email phone' }
      ],
      sort: { createdAt: -1 }
    };
    const result = await CarWashBooking.paginate(query, options);
    return res.json({ bookings: result.docs, pagination: { currentPage: result.page, totalPages: result.totalPages, total: result.totalDocs } });
  } catch (e) {
    console.error('listCarWashBookings error:', e);
    return res.status(500).json({ message: 'Server error', error: e.message });
  }
};

export const getCarWashBookingById = async (req, res) => {
  try {
    const booking = await CarWashBooking.findById(req.params.id).populate('customerId', 'name email phone');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    const isOwner = booking.customerId._id.toString() === req.user.id;
    if (req.user.role !== 'admin' && !isOwner) return res.status(403).json({ message: 'Not authorized' });
    return res.json({ booking });
  } catch (e) {
    console.error('getCarWashBookingById error:', e);
    return res.status(500).json({ message: 'Server error', error: e.message });
  }
};

export const updateCarWashBookingStatus = async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin access required' });
    const { status } = req.body;
    const allowed = ['Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'];
    if (!allowed.includes(status)) return res.status(400).json({ message: 'Invalid status' });
    const booking = await CarWashBooking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('customerId', 'name email');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    return res.json({ message: 'Status updated', booking });
  } catch (e) {
    console.error('updateCarWashBookingStatus error:', e);
    return res.status(500).json({ message: 'Server error', error: e.message });
  }
};

export const assignCarWashStaff = async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin access required' });
    const { staffId } = req.body;
    const booking = await CarWashBooking.findByIdAndUpdate(
      req.params.id,
      { assignedStaffId: staffId },
      { new: true }
    ).populate('customerId', 'name email');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    return res.json({ message: 'Staff assigned', booking });
  } catch (e) {
    console.error('assignCarWashStaff error:', e);
    return res.status(500).json({ message: 'Server error', error: e.message });
  }
};

export const markCarWashPayment = async (req, res) => {
  try {
    const { paymentStatus } = req.body;
    if (!['Paid', 'Unpaid'].includes(paymentStatus)) return res.status(400).json({ message: 'Invalid payment status' });
    // Owner or admin can update payment status
    const booking = await CarWashBooking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    const isOwner = booking.customerId.toString() === req.user.id;
    if (req.user.role !== 'admin' && !isOwner) return res.status(403).json({ message: 'Not authorized' });
    booking.paymentStatus = paymentStatus;
    await booking.save();
    return res.json({ message: 'Payment status updated', booking });
  } catch (e) {
    console.error('markCarWashPayment error:', e);
    return res.status(500).json({ message: 'Server error', error: e.message });
  }
};



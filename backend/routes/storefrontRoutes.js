import express from 'express';
import Accessory from '../models/Accessory.js';
import AccessoryOrder from '../models/AccessoryOrder.js';

const router = express.Router();

// Public: GET /api/items - list active accessories
router.get('/items', async (req, res) => {
  try {
    const accessories = await Accessory.find({ isActive: true }).sort({ createdAt: -1 }).lean();
    // Normalize image field for frontend
    const normalized = accessories.map((a) => ({
      ...a,
      imageUrl: a.image,
    }));
    res.json(normalized);
  } catch (err) {
    console.error('Storefront GET /items error:', err);
    res.status(500).json({ message: 'Failed to fetch items' });
  }
});

// Public: GET /api/orders/:userId - orders for a user
router.get('/orders/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Validate userId parameter
    if (!userId || userId === 'undefined' || userId === 'null') {
      return res.status(400).json({ message: 'Invalid user ID provided' });
    }
    
    // Check if userId is a valid ObjectId format
    if (!/^[0-9a-fA-F]{24}$/.test(userId)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }
    
    const orders = await AccessoryOrder.getByUser(userId);
    res.json(orders);
  } catch (err) {
    console.error('Storefront GET /orders/:userId error:', err);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

// Public: POST /api/orders - place a new order
// Expected body: { userId, items: [{ itemId, quantity }], address, phone, amount }
router.post('/orders', async (req, res) => {
  try {
    const { userId, items = [], address = '', phone = '', amount = 0 } = req.body || {};
    if (!userId || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Invalid order payload' });
    }

    // Build order payload compatible with AccessoryOrder model
    const builtItems = [];
    for (const it of items) {
      const accessory = await Accessory.findById(it.itemId).lean();
      if (!accessory) {
        return res.status(400).json({ message: `Accessory not found: ${it.itemId}` });
      }
      builtItems.push({ accessory: accessory._id, quantity: Number(it.quantity || 1), price: accessory.price });
    }

    const totalAmount = builtItems.reduce((sum, x) => sum + (x.price * x.quantity), 0);

    const order = new AccessoryOrder({
      user: userId,
      items: builtItems,
      totalAmount: totalAmount,
      paymentMethod: 'Cash on Delivery',
      shippingAddress: {
        street: address || 'N/A',
        city: 'N/A',
        state: 'N/A',
        zipCode: '000000',
        country: 'India'
      }
    });
    await order.save();

    res.status(201).json({ message: 'Order placed', orderId: order._id });
  } catch (err) {
    console.error('Storefront POST /orders error:', err);
    res.status(500).json({ message: 'Failed to place order' });
  }
});

export default router;



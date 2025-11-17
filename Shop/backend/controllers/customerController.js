import DailyFood from '../models/DailyFood.js';
import Order from '../models/Order.js';
import Counter from '../models/Counter.js';

// @desc    Get today's daily foods
// @route   GET /api/foods/daily
// @access  Public
export const getDailyFoods = async (req, res) => {
  try {
    // Get today's date at start of day
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get tomorrow's date at start of day
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const foods = await DailyFood.find({
      date: {
        $gte: today,
        $lt: tomorrow
      }
    }).sort({ createdAt: -1 });

    res.json(foods);
  } catch (error) {
    console.error('Get daily foods error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Place new order
// @route   POST /api/orders/place
// @access  Private
export const placeOrder = async (req, res) => {
  try {
    const { items, customerName, phone, location, total } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No items in order' });
    }

    // Get next order number
    let counter = await Counter.findOne({ name: 'orderNumber' });
    if (!counter) {
      counter = await Counter.create({ name: 'orderNumber', seq: 1000 });
    }
    counter.seq += 1;
    await counter.save();

    // Create order
    const order = await Order.create({
      orderNumber: counter.seq,
      items,
      total,
      customerId: req.user._id,
      customerName,
      phone,
      location,
    });

    // Update food quantities
    for (const item of items) {
      const food = await DailyFood.findById(item.foodId);
      if (food) {
        food.quantity -= item.qty;
        await food.save();
      }
    }

    res.status(201).json({
      message: 'Order placed successfully',
      orderNumber: order.orderNumber,
      order,
    });
  } catch (error) {
    console.error('Place order error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get customer's order history
// @route   GET /api/orders/history
// @access  Private
export const getOrderHistory = async (req, res) => {
  try {
    const orders = await Order.find({ customerId: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(orders);
  } catch (error) {
    console.error('Get order history error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get single order by order number
// @route   GET /api/orders/:orderNumber
// @access  Private
export const getOrderByNumber = async (req, res) => {
  try {
    const order = await Order.findOne({
      orderNumber: req.params.orderNumber,
      customerId: req.user._id,
    });

    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

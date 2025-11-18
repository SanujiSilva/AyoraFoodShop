import Food from '../models/Food.js';
import User from '../models/User.js';
import Order from '../models/Order.js';
import DailyFood from '../models/DailyFood.js';
import Location from '../models/Location.js';
import Notice from '../models/Notice.js';

// ==================== MASTER FOODS MANAGEMENT ====================

// Add new master food
export const addMasterFood = async (req, res) => {
  try {
    const { foodName, category, defaultPrice, description, image, isActive } = req.body;

    const existingFood = await Food.findOne({ foodName });
    if (existingFood) {
      return res.status(400).json({ message: 'Food with this name already exists' });
    }

    const newFood = new Food({
      foodName,
      category,
      defaultPrice,
      description,
      image,
      isActive: isActive !== undefined ? isActive : true,
    });

    await newFood.save();
    res.status(201).json(newFood);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all master foods
export const getAllMasterFoods = async (req, res) => {
  try {
    const foods = await Food.find().sort({ createdAt: -1 });
    res.json(foods);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get active master foods only
export const getActiveMasterFoods = async (req, res) => {
  try {
    const foods = await Food.find({ isActive: true }).sort({ foodName: 1 });
    res.json(foods);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update master food
export const updateMasterFood = async (req, res) => {
  try {
    const { id } = req.params;
    const { foodName, category, defaultPrice, description, image, isActive } = req.body;

    const food = await Food.findByIdAndUpdate(
      id,
      { foodName, category, defaultPrice, description, image, isActive },
      { new: true }
    );

    if (!food) {
      return res.status(404).json({ message: 'Food not found' });
    }

    res.json(food);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete master food
export const deleteMasterFood = async (req, res) => {
  try {
    const { id } = req.params;
    const food = await Food.findByIdAndDelete(id);

    if (!food) {
      return res.status(404).json({ message: 'Food not found' });
    }

    res.json({ message: 'Food deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ==================== DAILY FOODS MANAGEMENT ====================

// Add food
export const addFood = async (req, res) => {
  try {
    const { foodId, price, quantity, date, optionalDescription } = req.body;

    // Get food details from master catalog
    const masterFood = await Food.findById(foodId);
    if (!masterFood) {
      return res.status(404).json({ message: 'Food not found in master catalog' });
    }

    const newDailyFood = new DailyFood({
      food: foodId,
      foodName: masterFood.foodName,
      category: masterFood.category,
      price: price || masterFood.defaultPrice,
      quantity,
      description: masterFood.description,
      optionalDescription: optionalDescription || '',
      image: masterFood.image,
      date: date || new Date(),
    });

    await newDailyFood.save();
    res.status(201).json(newDailyFood);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all foods
export const getAllFoods = async (req, res) => {
  try {
    const foods = await DailyFood.find().populate('food').sort({ date: -1 });
    
    // Calculate ordered quantities for each food
    const foodsWithOrderedQty = await Promise.all(
      foods.map(async (food) => {
        // Get all orders that contain this food item
        const orders = await Order.find({
          'items.foodId': food._id,
          status: { $in: ['Pending', 'Confirm', 'Delivered'] } // Exclude cancelled
        });
        
        // Sum up the quantities ordered
        let orderedQty = 0;
        orders.forEach(order => {
          const item = order.items.find(i => i.foodId.toString() === food._id.toString());
          if (item) {
            orderedQty += item.qty;
          }
        });
        
        return {
          ...food.toObject(),
          orderedQty
        };
      })
    );
    
    res.json(foodsWithOrderedQty);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update food
export const updateFood = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const food = await DailyFood.findByIdAndUpdate(id, updates, { new: true });

    if (!food) {
      return res.status(404).json({ message: 'Food not found' });
    }

    res.json(food);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete food
export const deleteFood = async (req, res) => {
  try {
    const { id } = req.params;
    const food = await DailyFood.findByIdAndDelete(id);

    if (!food) {
      return res.status(404).json({ message: 'Food not found' });
    }

    res.json({ message: 'Food deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ==================== ORDER MANAGEMENT ====================

// Get all orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('customerId', 'name email')
      .sort({ date: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Add order manually
export const addOrderManually = async (req, res) => {
  try {
    const { items, total, customerName, phone, location } = req.body;

    // Validation
    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Please add at least one item' });
    }

    if (!customerName || !customerName.trim()) {
      return res.status(400).json({ message: 'Customer name is required' });
    }

    if (!phone || !phone.trim()) {
      return res.status(400).json({ message: 'Phone number is required' });
    }

    if (!location || !location.trim()) {
      return res.status(400).json({ message: 'Location is required' });
    }

    if (!total || total <= 0) {
      return res.status(400).json({ message: 'Invalid total amount' });
    }

    // Validate items structure
    for (const item of items) {
      if (!item.foodId || !item.foodName || !item.price || !item.qty) {
        return res.status(400).json({ message: 'Invalid item data' });
      }
    }

    // Get the next order number
    const Counter = (await import('../models/Counter.js')).default;
    const counter = await Counter.findOneAndUpdate(
      { name: 'orderNumber' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    const newOrder = new Order({
      orderNumber: counter.seq,
      items,
      total,
      customerName: customerName.trim(),
      phone: phone.trim(),
      location: location.trim(),
      status: 'Pending',
      date: new Date(),
    });

    await newOrder.save();
    
    console.log(`✅ Manual order created: #${counter.seq} for ${customerName}`);
    
    res.status(201).json(newOrder);
  } catch (error) {
    console.error('Error creating manual order:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get daily income
export const getDailyIncome = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get all orders for today
    const allOrders = await Order.find({
      date: { $gte: today },
    });

    // Get only delivered orders for income calculation
    const deliveredOrders = allOrders.filter(order => order.status === 'Delivered');
    const totalIncome = deliveredOrders.reduce((sum, order) => sum + order.total, 0);

    res.json({
      totalIncome,
      orderCount: allOrders.length, // Total orders count (all statuses)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get orders by location
export const getOrdersByLocation = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const orders = await Order.aggregate([
      {
        $match: {
          date: { $gte: today },
        },
      },
      {
        $group: {
          _id: '$location',
          count: { $sum: 1 },
          totalRevenue: { $sum: '$total' },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    console.log('Updating order status:', { id, status });

    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    console.log('Order updated:', order);
    res.json(order);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete orders by date
export const deleteOrdersByDate = async (req, res) => {
  try {
    const { date } = req.body;

    if (!date) {
      return res.status(400).json({ message: 'Date is required' });
    }

    // Parse the date and set time range for the full day
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    // Delete all orders within the date range
    const result = await Order.deleteMany({
      date: {
        $gte: startDate,
        $lte: endDate
      }
    });

    res.json({ 
      message: `${result.deletedCount} order(s) deleted successfully`,
      deletedCount: result.deletedCount 
    });
  } catch (error) {
    console.error('Error deleting orders:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ==================== CUSTOMER MANAGEMENT ====================

// Get all customers
export const getAllCustomers = async (req, res) => {
  try {
    const customers = await User.find({ role: 'customer' })
      .select('-password')
      .sort({ createdAt: -1 });
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete customer
export const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    const customer = await User.findOneAndDelete({ _id: id, role: 'customer' });

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Optionally: Delete all orders associated with this customer
    // await Order.deleteMany({ customerId: id });

    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ==================== ADMIN MANAGEMENT ====================

// Create admin
export const createAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const newAdmin = new User({
      name,
      email,
      password,
      role: 'admin',
    });

    await newAdmin.save();

    res.status(201).json({
      _id: newAdmin._id,
      name: newAdmin.name,
      email: newAdmin.email,
      role: newAdmin.role,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all admins
export const getAllAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: 'admin' })
      .select('-password')
      .sort({ createdAt: -1 });
    res.json(admins);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete admin
export const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent deletion of last admin
    const adminCount = await User.countDocuments({ role: 'admin' });
    if (adminCount <= 1) {
      return res.status(400).json({ message: 'Cannot delete the last admin' });
    }

    const admin = await User.findOneAndDelete({ _id: id, role: 'admin' });

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.json({ message: 'Admin deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ==================== LOCATION MANAGEMENT ====================

// Create location
export const createLocation = async (req, res) => {
  try {
    const { name, isActive } = req.body;

    const existingLocation = await Location.findOne({ name });
    if (existingLocation) {
      return res.status(400).json({ message: 'Location already exists' });
    }

    const newLocation = new Location({
      name,
      isActive: isActive !== undefined ? isActive : true,
    });

    await newLocation.save();
    res.status(201).json(newLocation);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all locations
export const getAllLocations = async (req, res) => {
  try {
    const locations = await Location.find().sort({ name: 1 });
    res.json(locations);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get active locations only
export const getActiveLocations = async (req, res) => {
  try {
    const locations = await Location.find({ isActive: true }).sort({ name: 1 });
    res.json(locations);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update location
export const updateLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, isActive } = req.body;

    const location = await Location.findByIdAndUpdate(
      id,
      { name, isActive },
      { new: true }
    );

    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }

    res.json(location);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete location
export const deleteLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const location = await Location.findByIdAndDelete(id);

    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }

    res.json({ message: 'Location deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ==================== NOTICE MANAGEMENT ====================

// Create notice
export const createNotice = async (req, res) => {
  try {
    const { title, message, type, isActive } = req.body;

    const newNotice = new Notice({
      title,
      message,
      type: type || 'info',
      isActive: isActive !== undefined ? isActive : true,
    });

    await newNotice.save();
    res.status(201).json(newNotice);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all notices
export const getAllNotices = async (req, res) => {
  try {
    const notices = await Notice.find().sort({ createdAt: -1 });
    res.json(notices);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get active notices only (public)
export const getActiveNotices = async (req, res) => {
  try {
    const notices = await Notice.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(notices);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update notice
export const updateNotice = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, message, type, isActive } = req.body;

    const notice = await Notice.findByIdAndUpdate(
      id,
      { title, message, type, isActive },
      { new: true }
    );

    if (!notice) {
      return res.status(404).json({ message: 'Notice not found' });
    }

    res.json(notice);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete notice
export const deleteNotice = async (req, res) => {
  try {
    const { id } = req.params;
    const notice = await Notice.findByIdAndDelete(id);

    if (!notice) {
      return res.status(404).json({ message: 'Notice not found' });
    }

    res.json({ message: 'Notice deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

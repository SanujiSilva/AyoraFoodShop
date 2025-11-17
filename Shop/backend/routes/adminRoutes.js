import express from 'express';
import { protect, admin } from '../middleware/auth.js';
import {
  // Master Foods
  addMasterFood,
  getAllMasterFoods,
  getActiveMasterFoods,
  updateMasterFood,
  deleteMasterFood,
  // Daily Foods
  addFood,
  getAllFoods,
  updateFood,
  deleteFood,
  // Orders
  getAllOrders,
  addOrderManually,
  updateOrderStatus,
  deleteOrdersByDate,
  getDailyIncome,
  getOrdersByLocation,
  // Customers
  getAllCustomers,
  deleteCustomer,
  // Admins
  createAdmin,
  getAllAdmins,
  deleteAdmin,
  // Locations
  createLocation,
  getAllLocations,
  updateLocation,
  deleteLocation,
  // Notices
  createNotice,
  getAllNotices,
  updateNotice,
  deleteNotice,
} from '../controllers/adminController.js';

const router = express.Router();

// Apply authentication middleware to all admin routes
router.use(protect);
router.use(admin);

// ==================== MASTER FOOD ROUTES ====================
router.post('/master-foods', addMasterFood);
router.get('/master-foods', getAllMasterFoods);
router.get('/master-foods/active', getActiveMasterFoods);
router.put('/master-foods/:id', updateMasterFood);
router.delete('/master-foods/:id', deleteMasterFood);

// ==================== DAILY FOOD ROUTES ====================
router.post('/foods', addFood);
router.get('/foods', getAllFoods);
router.put('/foods/:id', updateFood);
router.delete('/foods/:id', deleteFood);

// ==================== ORDER ROUTES ====================
router.get('/orders', getAllOrders);
router.post('/orders', addOrderManually);
router.put('/orders/:id/status', updateOrderStatus);
router.delete('/orders/delete-by-date', deleteOrdersByDate);
router.get('/daily-income', getDailyIncome);
router.get('/orders-by-location', getOrdersByLocation);

// ==================== CUSTOMER ROUTES ====================
router.get('/customers', getAllCustomers);
router.delete('/customers/:id', deleteCustomer);

// ==================== ADMIN MANAGEMENT ROUTES ====================
router.post('/admins', createAdmin);
router.get('/admins', getAllAdmins);
router.delete('/admins/:id', deleteAdmin);

// ==================== LOCATION ROUTES ====================
router.post('/locations', createLocation);
router.get('/locations', getAllLocations);
router.put('/locations/:id', updateLocation);
router.delete('/locations/:id', deleteLocation);

// ==================== NOTICE ROUTES ====================
router.post('/notices', createNotice);
router.get('/notices', getAllNotices);
router.put('/notices/:id', updateNotice);
router.delete('/notices/:id', deleteNotice);

export default router;

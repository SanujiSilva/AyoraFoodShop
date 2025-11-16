import express from 'express';
import {
  placeOrder,
  getOrderHistory,
  getOrderByNumber,
} from '../controllers/customerController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/place', protect, placeOrder);
router.get('/history', protect, getOrderHistory);
router.get('/:orderNumber', protect, getOrderByNumber);

export default router;

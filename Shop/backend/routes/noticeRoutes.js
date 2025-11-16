import express from 'express';
import { getActiveNotices } from '../controllers/adminController.js';

const router = express.Router();

// Public routes
router.get('/active', getActiveNotices);

export default router;

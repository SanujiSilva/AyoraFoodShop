import express from 'express';
import { getActiveLocations } from '../controllers/adminController.js';

const router = express.Router();

// Public routes
router.get('/active', getActiveLocations);

export default router;

import express from 'express';
import { getDailyFoods } from '../controllers/customerController.js';

const router = express.Router();

router.get('/daily', getDailyFoods);

export default router;

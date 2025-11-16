import mongoose from 'mongoose';

const dailyFoodSchema = new mongoose.Schema({
  food: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Food',
    required: [true, 'Food reference is required'],
  },
  foodName: {
    type: String,
    required: [true, 'Food name is required'],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0,
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: 0,
  },
  description: {
    type: String,
    trim: true,
  },
  image: {
    type: String,
    default: 'https://via.placeholder.com/300x200?text=Food+Item',
  },
  date: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const DailyFood = mongoose.model('DailyFood', dailyFoodSchema);

export default DailyFood;

import mongoose from 'mongoose';

const foodSchema = new mongoose.Schema({
  foodName: {
    type: String,
    required: [true, 'Food name is required'],
    trim: true,
    unique: true,
  },
  category: {
    type: String,
    enum: ['Rice', 'Noodles', 'Kottu', 'Burgers', 'Submarines', 'Pizza', 'Biriyani', 'Hoppers', 'Short Eats', 'Gravy', 'Other'],
    default: 'Other',
  },
  defaultPrice: {
    type: Number,
    required: [true, 'Default price is required'],
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
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt timestamp before saving
foodSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Food = mongoose.model('Food', foodSchema);

export default Food;

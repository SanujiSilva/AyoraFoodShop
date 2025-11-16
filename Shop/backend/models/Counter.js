import mongoose from 'mongoose';

// Counter schema for auto-incrementing order numbers
const counterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  seq: {
    type: Number,
    default: 1000,
  },
});

const Counter = mongoose.model('Counter', counterSchema);

export default Counter;

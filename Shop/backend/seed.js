import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import DailyFood from './models/DailyFood.js';
import User from './models/User.js';

dotenv.config();

const foods = [
  {
    foodName: 'Rice & Curry',
    price: 250,
    quantity: 100,
    description: 'Traditional Sri Lankan rice and curry with vegetables and chicken',
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400',
  },
  {
    foodName: 'Fried Rice',
    price: 300,
    quantity: 80,
    description: 'Special fried rice with chicken, vegetables, and egg',
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400',
  },
  {
    foodName: 'Kottu Roti',
    price: 350,
    quantity: 60,
    description: 'Chopped roti mixed with vegetables, egg, and spices',
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400',
  },
  {
    foodName: 'Chicken Noodles',
    price: 280,
    quantity: 70,
    description: 'Stir-fried noodles with chicken and fresh vegetables',
    image: 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=400',
  },
  {
    foodName: 'Veggie Burger',
    price: 220,
    quantity: 50,
    description: 'Healthy vegetarian burger with fresh ingredients',
    image: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=400',
  },
  {
    foodName: 'Chicken Submarine',
    price: 320,
    quantity: 45,
    description: 'Large submarine sandwich with grilled chicken',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400',
  },
  {
    foodName: 'Pizza Margherita',
    price: 450,
    quantity: 30,
    description: 'Classic Italian pizza with fresh mozzarella and basil',
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400',
  },
  {
    foodName: 'Biriyani',
    price: 380,
    quantity: 65,
    description: 'Aromatic basmati rice with spiced chicken',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400',
  },
];

const admin = {
  name: 'Admin User',
  email: 'admin@ayorafoods.com',
  password: 'admin123',
  role: 'admin',
};

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await DailyFood.deleteMany();
    
    // Check if admin exists
    const adminExists = await User.findOne({ email: admin.email });
    if (!adminExists) {
      await User.create(admin);
      console.log('✅ Admin user created');
    } else {
      console.log('ℹ️  Admin user already exists');
    }

    // Insert food items
    console.log('📦 Inserting food items...');
    await DailyFood.insertMany(foods);

    console.log('✅ Data seeded successfully!');
    console.log(`   - ${foods.length} food items added`);
    console.log('\n📝 Admin Login Credentials:');
    console.log('   Email: admin@ayorafoods.com');
    console.log('   Password: admin123\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seedData();

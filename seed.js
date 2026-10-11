const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const connectDB = require('./config/db');
const User = require('./models/User');
const MenuItem = require('./models/MenuItem');
const Table = require('./models/Table');

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing collections
    await User.deleteMany();
    await MenuItem.deleteMany();
    await Table.deleteMany();

    // Hash passwords for seed users (Requirement for Question 5)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    // 1. Add Users (Hashed Passwords)
    await User.create([
      { name: 'John Customer', email: 'customer@test.com', password: hashedPassword, role: 'customer' },
      { name: 'Admin Manager', email: 'manager@test.com', password: hashedPassword, role: 'manager' },
    ]);

    // 2. Add 15 Menu Items
    const categories = ['Burgers', 'Pizza', 'Drinks', 'Desserts', 'Mains'];
    const menuItems = [];
    for (let i = 1; i <= 15; i++) {
      menuItems.push({
        name: `Special Dish ${i}`,
        category: categories[i % categories.length],
        price: 5 + i * 2,
        description: `Delicious meal option number ${i}`,
        image: 'https://via.placeholder.com/150',
        isAvailable: true,
      });
    }
    await MenuItem.insertMany(menuItems);

    // 3. Add 6 Tables
    const tables = [];
    for (let i = 1; i <= 6; i++) {
      tables.push({ tableNumber: i, seats: i <= 2 ? 2 : 4 });
    }
    await Table.insertMany(tables);

    console.log('Database Seeded Successfully with Hashed Passwords! 🌱');
    process.exit();
  } catch (error) {
    console.error(`Seeding Failed: ${error.message}`);
    process.exit(1);
  }
};

seedData();
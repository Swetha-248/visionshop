require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const path = require('path');
const apiRoutes = require('./routes/api');
const Product = require('./models/Product');
const productsSeed = require('./data/products.json');

const app = express();
const PORT = process.env.PORT || 5000;

const connectToMongo = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/visionshop');
    console.log('MongoDB connected');

    const count = await Product.countDocuments();
    if (count === 0) {
      await Product.insertMany(productsSeed);
      console.log('Seeded product data into MongoDB');
    }
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
  }
};

connectToMongo();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api', apiRoutes);

app.get('/', (req, res) => {
  res.send('VisionShop AI Backend API is running...');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

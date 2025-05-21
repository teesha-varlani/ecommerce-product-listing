//file to add mock data in mongo database,  can be ignored

const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const products = Array.from({ length: 15 }, (_, i) => ({
  name: `Sample Product ${i + 1}`,
  price: Math.floor(Math.random() * 100) + 10,
  image: `https://via.placeholder.com/300x200?text=Product+${i + 1}`,
}));

Product.insertMany(products)
  .then(() => {
    console.log('✅ Inserted 15 test products');
    mongoose.disconnect();
  })
  .catch((err) => {
    console.error('error inserting products:', err);
    mongoose.disconnect();
  });

const express = require('express');
const Product = require('../models/Product');
const verifyToken = require('../middleware/authMiddleware'); // authentication middleware
const router = express.Router();

// get all products
router.get('/', async (req, res) => {
  const { page = 1, sort = 'asc', search = '' } = req.query;
  const limit = 10;
  const skip = (page - 1) * limit;

  const query = {
    name: { $regex: search, $options: 'i' }, //makes search case insensitive
  };

  try {
    const products = await Product.find(query)
      .sort({ price: sort === 'desc' ? -1 : 1 })
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments(query);

    res.json({
      products,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// for adding new product - for admin only
router.post('/', verifyToken, async (req, res) => {
  const { name, price, image } = req.body;
  try {
    const newProduct = new Product({ name, price, image });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// edit product  for admin only
router.put('/:id', verifyToken, async (req, res) => {
  const { name, price, image } = req.body;
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { name, price, image },
      { new: true }
    );
    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// delete product for admin only
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

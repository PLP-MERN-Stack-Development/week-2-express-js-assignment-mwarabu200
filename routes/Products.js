const express = require('express');
const router = express.Router();
const Product = require('../models/product'); // ✅ Import your Mongoose model
const { NotFoundError } = require('../utils/errors');
const asyncWrapper = require('../utils/asyncWrapper');
const auth = require('../middlewares/auth');
const validateProduct = require('../middlewares/validateProduct');

//original get all products
router.get('/:id', asyncWrapper(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new NotFoundError('Product not found');
  res.json(product);
}
));

// Updated GET with filtering support
router.get('/', asyncWrapper(async (req, res) => {
  const { category } = req.query;
  const filter = category ? { category } : {};
  const products = await Product.find(filter);
  res.json(products);
}
));

router.get('/', asyncWrapper(async (req, res) => {
  const { category, page = 1, limit = 10 } = req.query;
  const filter = category ? { category } : {};

  const products = await Product.find(filter)
    .skip((page - 1) * limit)
    .limit(Number(limit));

  res.json(products);
}));

// GET /api/products?search=
router.get('/', asyncWrapper(async (req, res) => {
  const { category, search, page = 1, limit = 10 } = req.query;
  let filter = {};

  if (category) filter.category = category;
  if (search) filter.name = { $regex: search, $options: 'i' }; // case-insensitive

  const products = await Product.find(filter)
    .skip((page - 1) * limit)
    .limit(Number(limit));

  res.json(products);
}));


// GET all products from MongoDB
router.get('/', auth, async (req, res) => {
  try {
    const products = await Product.find(); // ✅ MongoDB call
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

//Get a product by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: 'Invalid product ID' });
  }
});



// POST a new product
router.post('/', auth, validateProduct, async (req, res) => {
  try {
    const product = new Product(req.body); // Create a new product from request body
    await product.save();                  // Save to MongoDB
    res.status(201).json(product);         // Respond with the created product
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
//update an existing product
router.put('/product/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!product) return res.status(404).send();
        res.send(task);
    } catch (error) {
       res.status(500).send(error); 
    }
});

// DELETE /api/products/:id - Delete a product by ID
router.delete('/:id', auth, async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully', product: deletedProduct });
  } catch (error) {
    res.status(400).json({ message: 'Invalid product ID' });
  }
});



module.exports = router;

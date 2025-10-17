const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const app = express();

// -----------------------------
// Middleware
// -----------------------------
app.use(cors());
app.use(express.json());

// -----------------------------
// Serve static frontend files
// -----------------------------
const frontendPath = path.join(__dirname, '../frontend');
app.use(express.static(frontendPath)); // serves css/, js/, images, etc.

// -----------------------------
// Connect MongoDB
// -----------------------------
const MONGO = process.env.MONGO || 'mongodb://127.0.0.1:27017/ecommerce';
mongoose.connect(MONGO)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// -----------------------------
// Product model
// -----------------------------
const ProductSchema = new mongoose.Schema({
  name: String,
  price: Number,
  image: String,
  description: String,
  category: String,
  stock: Number
});
const Product = mongoose.model('Product', ProductSchema);

// -----------------------------
// Routes: CRUD for products
// -----------------------------
app.get('/api/products', async (req, res) => {
  try {
    const q = req.query.q;
    const filter = q
      ? { $or: [
          { name: { $regex: q, $options: 'i' } },
          { category: { $regex: q, $options: 'i' } }
        ]}
      : {};
    const products = await Product.find(filter);
    res.json(products);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', err });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const p = await Product.findById(req.params.id);
    if (!p) return res.status(404).json({ msg: 'Not found' });
    res.json(p);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', err });
  }
});

// -----------------------------
// Admin token authentication
// -----------------------------
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'admintoken123';

const adminAuth = (req, res, next) => {
  if (req.headers.authorization !== `Bearer ${ADMIN_TOKEN}`) {
    return res.status(401).json({ msg: 'Unauthorized' });
  }
  next();
};

app.post('/api/admin/products', adminAuth, async (req, res) => {
  const prod = await Product.create(req.body);
  res.json(prod);
});

app.put('/api/admin/products/:id', adminAuth, async (req, res) => {
  const prod = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(prod);
});

app.delete('/api/admin/products/:id', adminAuth, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ msg: 'Deleted' });
});

// -----------------------------
// SPA fallback route (Express 4.x compatible)
// -----------------------------
// Serve static frontend files first
app.use(express.static(frontendPath));

// SPA fallback for all non-API requests
app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API route not found' });
  }

  res.sendFile(path.join(frontendPath, 'index.html'));
});


// -----------------------------
// Start server
// -----------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

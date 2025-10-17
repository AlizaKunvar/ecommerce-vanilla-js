const mongoose = require('mongoose');
require('dotenv').config();

const ProductSchema = new mongoose.Schema({
  name: String,
  price: Number,
  image: String,
  description: String,
  category: String,
  stock: Number
});
const Product = mongoose.model('Product', ProductSchema);

const MONGO = process.env.MONGO || 'mongodb://127.0.0.1:27017/ecommerce';

mongoose.connect(MONGO)
  .then(async () => {
    console.log('✅ Connected to MongoDB');
    
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing products');
    
    const items = [
      { 
        name: 'Classic T-Shirt', 
        price: 19.99, 
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500', 
        description: 'Comfy cotton t-shirt for everyday wear', 
        category: 'Clothing', 
        stock: 50 
      },
      { 
        name: 'Running Shoes', 
        price: 79.99, 
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500', 
        description: 'Lightweight running shoes for athletes', 
        category: 'Footwear', 
        stock: 20 
      },
      { 
        name: 'Wireless Headphones', 
        price: 129.99, 
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', 
        description: 'Noise-cancelling wireless headphones', 
        category: 'Electronics', 
        stock: 15 
      },
      { 
        name: 'Smart Watch', 
        price: 199.99, 
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500', 
        description: 'Fitness tracking smartwatch', 
        category: 'Electronics', 
        stock: 30 
      },
      { 
        name: 'Denim Jeans', 
        price: 49.99, 
        image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500', 
        description: 'Classic blue denim jeans', 
        category: 'Clothing', 
        stock: 40 
      },
      { 
        name: 'Backpack', 
        price: 39.99, 
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500', 
        description: 'Durable travel backpack', 
        category: 'Accessories', 
        stock: 60 
      },
      { 
        name: 'Sunglasses', 
        price: 89.99, 
        image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500', 
        description: 'Polarized UV protection sunglasses', 
        category: 'Accessories', 
        stock: 45 
      },
      { 
        name: 'Yoga Mat', 
        price: 29.99, 
        image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500', 
        description: 'Non-slip yoga mat', 
        category: 'Sports', 
        stock: 70 
      }
    ];
    
    await Product.insertMany(items);
    console.log(`✅ Seeded ${items.length} products successfully!`);
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Error seeding:', err);
    process.exit(1);
  });
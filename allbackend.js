const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const crypto = require('crypto'); // For hashing

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connections
mongoose.connect('mongodb://localhost:27017/estrella', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB:', err));

// Email Schema & Model
const emailSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: v => /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v),
            message: props => `${props.value} is not a valid email address!`
        }
    },
    subscriptionDate: { type: Date, default: Date.now }
});
const Email = mongoose.model('emails', emailSchema, 'emails');

// Product Schema & Model
const productSchema = new mongoose.Schema({
    product_code: String,
    product_name: String,
    product_price: Number,
    product_imageurl: String
}, { strict: false });
const Product = mongoose.model('product', productSchema, 'product');

// Order Schema & Model
const orderSchema = new mongoose.Schema({
    cart: Array,
    address: Object,
    pricing: Object,
    hash: String,
    orderDate: { type: Date, default: Date.now },
    status: { type: String, default: 'pending' }
});
const Order = mongoose.model('order', orderSchema, 'orders');

// Utility to generate hash from order object
function generateHash(data) {
    const str = JSON.stringify(data);
    return crypto.createHash('sha256').update(str).digest('hex');
}

// Email subscription endpoint
app.post('/api/subscribe', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ error: 'Email is required' });

        const existingEmail = await Email.findOne({ email });
        if (existingEmail) return res.status(409).json({ error: 'This email is already subscribed' });

        const newEmail = new Email({ email });
        await newEmail.save();

        res.status(201).json({ message: 'Successfully subscribed to newsletter!' });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: 'Please enter a valid email address' });
        }
        console.error('Error saving email:', error);
        res.status(500).json({ error: 'Server error, please try again later' });
    }
});

// Add to collection endpoint
app.post('/api/add-to-collection', async (req, res) => {
    const { productName, size } = req.body;

    if (!productName || !size) {
        return res.status(400).json({ success: false, message: 'Product name and size are required' });
    }

    try {
        const product = await Product.findOne({ product_code: productName });

        if (product) {
            res.json({ success: true, product, size });
        } else {
            res.status(404).json({ success: false, message: 'Product not found' });
        }
    } catch (err) {
        console.error('Error fetching product:', err);
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
});

// Checkout endpoint
app.post('/api/checkout', async (req, res) => {
    const { cart, address } = req.body;

    if (!cart || !Array.isArray(cart) || cart.length === 0 || !address) {
        return res.status(400).json({ success: false, message: 'Invalid request. Cart items and address details are required.' });
    }

    try {
        const productCodes = cart.map(item => item.productCode);
        const products = await Product.find({ product_code: { $in: productCodes } });

        if (!products || products.length === 0) {
            return res.status(404).json({ success: false, message: 'No products found in database' });
        }

        const enhancedCart = cart.map(cartItem => {
            const productData = products.find(p => p.product_code === cartItem.productCode);
            if (!productData) return null;

            return {
                _id: productData._id,
                productCode: productData.product_code,
                productName: productData.product_name,
                price: productData.product_price,
                imageUrl: productData.product_imageurl,
                size: cartItem.size
            };
        }).filter(Boolean);

        const subtotal = enhancedCart.reduce((sum, item) => sum + (item.price || 0), 0);
        const discount = parseFloat((subtotal * 0.1).toFixed(2));
        const delivery = subtotal > 700 ? 0 : 150;
        const total = parseFloat((subtotal + delivery - discount).toFixed(2));

        const orderSummary = {
            cart: enhancedCart,
            address,
            pricing: { subtotal, discount, delivery, total },
            orderDate: new Date(),
            status: 'pending'
        };

        // Generate hash for the order
        const hash = generateHash(orderSummary);

        console.log('Checkout Response:', { ...orderSummary, hash }); // Log the response data

        return res.status(200).json({
            success: true,
            order: { ...orderSummary, hash }
        });
    } catch (err) {
        console.error('Error processing checkout:', err);
        res.status(500).json({ success: false, message: 'Server error processing order', error: err.message });
    }
});

// Verify and Save Order endpoint
app.post('/api/verify-and-save', async (req, res) => {
    const { cart, address, pricing, hash } = req.body;

    try {
        const reconstructedOrder = { cart, address, pricing };
        const generatedHash = generateHash(reconstructedOrder);

        // Compare hashes to ensure data integrity
        if (generatedHash !== hash) {
            console.log('Hash Mismatch:', { receivedHash: hash, generatedHash, reconstructedOrder }); // Log hash mismatch
            return res.status(400).json({ success: false, message: 'Hash mismatch — data was modified' });
        }

        // Save the order to the database
        const newOrder = new Order({ cart, address, pricing, hash: generatedHash });
        await newOrder.save();

        console.log('Order Successfully Saved:', newOrder); // Log the saved order

        res.status(200).json({ success: true, message: 'Order successfully placed and saved to database.' });
    } catch (err) {
        console.error('Error verifying and saving order:', err);
        res.status(500).json({ success: false, message: 'Server error while saving order', error: err.message });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
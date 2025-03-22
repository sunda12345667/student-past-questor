
const dotenv = require('dotenv');
const Paystack = require('paystack');

dotenv.config();

// Initialize Paystack with the provided live secret key
// Note: In production, it's better to use environment variables for security
const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY || "sk_live_27e692300ed3d698eabd2087ce84dc0977ff0edb";
const paystack = Paystack(paystackSecretKey);

module.exports = paystack;


const dotenv = require('dotenv');
const Paystack = require('paystack');

dotenv.config();

// Initialize Paystack with your secret key from .env file
// REPLACE: You MUST get your secret key from your Paystack dashboard > Settings > API Keys & Webhooks
// IMPORTANT: Never commit your actual secret key to version control
// Copy your key to the .env file (not .env.example)
const paystack = Paystack(process.env.PAYSTACK_SECRET_KEY);

module.exports = paystack;

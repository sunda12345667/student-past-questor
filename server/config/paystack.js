
const dotenv = require('dotenv');
const Paystack = require('paystack');

dotenv.config();

// Initialize Paystack with the provided live secret key
const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY || "sk_live_27e692300ed3d698eabd2087ce84dc0977ff0edb";

let paystack;
try {
  paystack = Paystack(paystackSecretKey);
  console.log("Paystack initialized successfully");
} catch (error) {
  console.error("Error initializing Paystack:", error);
  // Create a minimal paystack object to prevent app crashes
  paystack = {
    customer: {},
    transaction: {},
    plan: {},
    page: {},
    subscription: {}
  };
}

module.exports = paystack;

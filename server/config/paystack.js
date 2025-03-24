
const dotenv = require('dotenv');

dotenv.config();

// Create a mock paystack object to prevent errors
const paystack = {
  customer: {
    create: () => Promise.resolve({ status: true, data: { message: "Temporarily disabled" } }),
    list: () => Promise.resolve({ status: true, data: [] }),
  },
  transaction: {
    initialize: () => Promise.resolve({ status: true, data: { reference: `mock-${Date.now()}` } }),
    verify: () => Promise.resolve({ status: true, data: { status: "success" } }),
  },
  plan: {},
  page: {},
  subscription: {}
};

console.log("Mock Paystack initialized for debugging");

module.exports = paystack;

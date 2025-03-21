
const dotenv = require('dotenv');
const Paystack = require('paystack');

dotenv.config();

const paystack = Paystack(process.env.PAYSTACK_SECRET_KEY);

module.exports = paystack;

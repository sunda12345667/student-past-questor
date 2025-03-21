
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const paymentRoutes = require('./routes/payment');
const authRoutes = require('./routes/auth');
const questionsRoutes = require('./routes/questions');
const billsRoutes = require('./routes/bills');

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/payment', paymentRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/questions', questionsRoutes);
app.use('/api/bills', billsRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('StudyQuest API is running');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

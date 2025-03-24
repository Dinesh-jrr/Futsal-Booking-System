const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const futsalRoutes=require('./routes/futsalRoutes');
const paymentRoutes=require('./routes/paymentRoutes');
const bodyParser = require('body-parser');
const cors = require('cors');

dotenv.config();
console.log('Mongo URI:', process.env.MONGO_URI);
connectDB();

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Routes
//user routes
app.use('/api/users', userRoutes);

//bookings routes
app.use('/api', bookingRoutes);

//futsal routes
app.use('/api',futsalRoutes);

//payments routes
app.use('/api',paymentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT,'0.0.0.0', () => console.log(`Server running on port ${PORT}`));

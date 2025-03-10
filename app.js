const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const futsalRoutes=require('./routes/futsalRoutes')
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

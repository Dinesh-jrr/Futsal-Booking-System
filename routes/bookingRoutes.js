const express = require('express');
const {
  createBooking,
  getUserBookings,
  getOwnerBookings,
  getAllBookings,
  getBookingById,
  cancelBooking,
  updateBooking,
  approveBooking
} = require('../controllers/bookingController');

const router = express.Router();

router.post('/bookings', createBooking); // Create a new booking
router.get('/bookings/user/:userId', getUserBookings); // Get bookings for a user
router.get('/bookings/owner/:ownerId', getOwnerBookings); // Get bookings for an owner
router.get('/bookings/allBookings', getAllBookings); // Get all bookings (admin)
router.get('/bookings/:bookingId', getBookingById); // Get a single booking by ID
router.put('/bookings/:bookingId/cancel', cancelBooking); // Cancel a booking
router.put('/bookings/:bookingId', updateBooking)
router.put('/bookings/:bookingId/approve', approveBooking);



module.exports = router;

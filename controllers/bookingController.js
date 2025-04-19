const Booking = require('../models/bookings');
const Futsal = require('../models/futsals');
const sendNotification = require('../utils/sendNotification');

// Create a new booking
exports.createBooking = async (req, res) => {
  try {
    const {
      futsalName,
      selectedDay,
      selectedTimeSlot,
      totalCost,
      advancePayment,
      userId
    } = req.body;

    // 1. Save booking to DB
    const newBooking = new Booking({
      futsalName,
      selectedDay,
      selectedTimeSlot,
      totalCost,
      advancePayment,
      userId
    });

    const savedBooking = await newBooking.save();

    // 2. Send push notification
    const title = "Booking Confirmed!";
    const message = `Your booking for ${futsalName} on ${selectedDay} at ${selectedTimeSlot} has been confirmed.`;

    await sendNotification(userId, title, message);

    // 3. Return response
    res.status(201).json({
      message: 'Booking created successfully!',
      booking: savedBooking
    });

  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({
      message: 'Error creating booking',
      error: error.message
    });
  }
};

// Get all bookings for a user
exports.getUserBookings = async (req, res) => {
  try {
    const userId = req.params.userId;
    const userBookings = await Booking.find({ userId });

    res.status(200).json({
      message: 'User bookings retrieved successfully!',
      bookings: userBookings,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving user bookings',
      error: error.message,
    });
  }
};

// ✅ Get all bookings for a futsal owner
exports.getOwnerBookings = async (req, res) => {
  try {
    const ownerId = req.params.ownerId;

    // Find all futsals owned by this owner
    const ownerFutsals = await Futsal.find({ ownerId });

    if (!ownerFutsals || ownerFutsals.length === 0) {
      return res.status(404).json({ message: 'No futsals found for this owner' });
    }

    // Use futsalName, not name
    const futsalNames = ownerFutsals.map(f => f.futsalName);

    const ownerBookings = await Booking.find({ futsalName: { $in: futsalNames } });

    res.status(200).json({
      message: 'Owner bookings retrieved successfully!',
      bookings: ownerBookings,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving owner bookings',
      error: error.message,
    });
  }
};

// Get all bookings (for admin)
exports.getAllBookings = async (req, res) => {
  try {
    const allBookings = await Booking.find();
    res.status(200).json({
      message: 'All bookings retrieved successfully!',
      bookings: allBookings,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving all bookings',
      error: error.message,
    });
  }
};

// Get a single booking by ID
exports.getBookingById = async (req, res) => {
  try {
    const bookingId = req.params.bookingId;
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.status(200).json({
      message: 'Booking retrieved successfully!',
      booking,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving booking',
      error: error.message,
    });
  }
};

// Cancel a booking
exports.cancelBooking = async (req, res) => {
  try {
    const bookingId = req.params.bookingId;

    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      { status: 'cancelled' },
      { new: true }
    );

    if (!updatedBooking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.status(200).json({
      message: 'Booking cancelled successfully!',
      booking: updatedBooking,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error cancelling booking',
      error: error.message,
    });
  }
};

// ✅ Update a booking
exports.updateBooking = async (req, res) => {
  try {
    const bookingId = req.params.bookingId;
    const updateData = req.body;

    const updatedBooking = await Booking.findByIdAndUpdate(bookingId, updateData, {
      new: true,
    });

    if (!updatedBooking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.status(200).json({
      message: 'Booking updated successfully!',
      booking: updatedBooking,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error updating booking',
      error: error.message,
    });
  }
};



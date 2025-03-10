const Futsal = require('../models/futsals');
const User = require('../models/user'); // Ensure you have a user model
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

// Create a new futsal
exports.createFutsal = async (req, res) => {
    try {
      const { futsalName, location, ownerId, pricePerHour, availableTimeSlots, contactNumber, images } = req.body;
  
      // Validate if ownerId is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(ownerId)) {
        return res.status(400).json({ message: "Invalid owner ID format." });
      }
  
      // Check if owner exists
      const ownerExists = await User.findById(ownerId);
      if (!ownerExists) {
        return res.status(404).json({ message: "Owner not found." });
      }
  
      // Check if the owner already has a futsal
      const existingOwnerFutsal = await Futsal.findOne({ ownerId });
      if (existingOwnerFutsal) {
        return res.status(400).json({ message: "This owner already has a futsal registered." });
      }
  
      // Check for duplicate futsal futsalName
      const existingFutsal = await Futsal.findOne({ futsalName });
      if (existingFutsal) {
        return res.status(400).json({ message: "Futsal with this futsalName already exists." });
      }
  
      const newFutsal = new Futsal({
        futsalName,
        location,
        ownerId: new ObjectId(ownerId),
        pricePerHour,
        availableTimeSlots,
        contactNumber,
        images,
      });
  
      const savedFutsal = await newFutsal.save();
  
      res.status(201).json({
        message: 'Futsal created successfully!',
        futsal: savedFutsal,
      });
    } catch (error) {
      res.status(500).json({
        message: 'Error creating futsal',
        error: error.message,
      });
    }
  };
  

// Get all futsals
exports.getAllFutsals = async (req, res) => {
    try {
      // Fetch all futsals and populate ownerId field with the owner information
      const futsals = await Futsal.find(); // Populate with correct fields from User schema
  
      res.status(200).json({
        message: 'All futsals retrieved successfully!',
        futsals,
      });
    } catch (error) {
      res.status(500).json({
        message: 'Error retrieving futsals',
        error: error.message,
      });
    }
  };
  
  
  
// Get a single futsal by ID
exports.getFutsalById = async (req, res) => {
  try {
    const futsalId = req.params.futsalId;

    if (!mongoose.Types.ObjectId.isValid(futsalId)) {
      return res.status(400).json({ message: "Invalid futsal ID format." });
    }

    const futsal = await Futsal.findById(futsalId);

    if (!futsal) {
      return res.status(404).json({ message: 'Futsal not found' });
    }

    res.status(200).json({
      message: 'Futsal retrieved successfully!',
      futsal,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving futsal',
      error: error.message,
    });
  }
};

// Update a futsal
exports.updateFutsal = async (req, res) => {
  try {
    const futsalId = req.params.futsalId;
    const updatedData = req.body;

    if (!mongoose.Types.ObjectId.isValid(futsalId)) {
      return res.status(400).json({ message: "Invalid futsal ID format." });
    }

    // Ensure the owner exists if updating the ownerId
    if (updatedData.ownerId && !mongoose.Types.ObjectId.isValid(updatedData.ownerId)) {
      return res.status(400).json({ message: "Invalid owner ID format." });
    }

    if (updatedData.ownerId) {
      const ownerExists = await User.findById(updatedData.ownerId);
      if (!ownerExists) {
        return res.status(404).json({ message: "Owner not found." });
      }
    }

    const updatedFutsal = await Futsal.findByIdAndUpdate(futsalId, updatedData, { new: true }).populate('ownerId', 'futsalName email');

    if (!updatedFutsal) {
      return res.status(404).json({ message: 'Futsal not found' });
    }

    res.status(200).json({
      message: 'Futsal updated successfully!',
      futsal: updatedFutsal,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error updating futsal',
      error: error.message,
    });
  }
};

// Delete a futsal
exports.deleteFutsal = async (req, res) => {
    try {
      const futsalId = req.params.futsalId;
    //   const userId = req.user.id;  // Assuming you have a user ID from the auth middleware
  
      if (!mongoose.Types.ObjectId.isValid(futsalId)) {
        return res.status(400).json({ message: "Invalid futsal ID format." });
      }
  
      const futsal = await Futsal.findById(futsalId);
  
      if (!futsal) {
        return res.status(404).json({ message: 'Futsal not found' });
      }
  
    //   // Check if the logged-in user is the owner of the futsal or an admin
    //   if (futsal.ownerId.toString() !== userId && req.user.role !== 'admin') {
    //     return res.status(403).json({ message: 'Unauthorized to delete this futsal' });
    //   }
  
      const deletedFutsal = await Futsal.findByIdAndDelete(futsalId);
  
      res.status(200).json({
        message: 'Futsal deleted successfully!',
        futsal: deletedFutsal,
      });
    } catch (error) {
      res.status(500).json({
        message: 'Error deleting futsal',
        error: error.message,
      });
    }
  };
  

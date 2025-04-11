const Futsal = require('../models/futsals');
const User = require('../models/user');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

// Create a new futsal
exports.createFutsal = async (req, res) => {
  try {
    const {
      futsalName,
      location,
      coordinates,
      ownerId,
      pricePerHour,
      availableTimeSlots,
      contactNumber,
      images,
      documents
    } = req.body;

    // Validate ownerId
    if (!mongoose.Types.ObjectId.isValid(ownerId)) {
      return res.status(400).json({ message: "Invalid owner ID format." });
    }

    const ownerExists = await User.findById(ownerId);
    if (!ownerExists) {
      return res.status(404).json({ message: "Owner not found." });
    }

    const existingOwnerFutsal = await Futsal.findOne({ ownerId });
    if (existingOwnerFutsal) {
      return res.status(400).json({ message: "This owner already has a futsal registered." });
    }

    const existingFutsal = await Futsal.findOne({ futsalName });
    if (existingFutsal) {
      return res.status(400).json({ message: "Futsal with this name already exists." });
    }

    const newFutsal = new Futsal({
      futsalName,
      location,
      coordinates,
      ownerId: new ObjectId(ownerId),
      pricePerHour,
      availableTimeSlots,
      contactNumber,
      images,
      documents
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
    const futsals = await Futsal.find();
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

//Update a futsal
exports.updateFutsal = async (req, res) => {
  try {
    const futsalId = req.params.futsalId;
    const updatedData = req.body;

    if (!mongoose.Types.ObjectId.isValid(futsalId)) {
      return res.status(400).json({ message: "Invalid futsal ID format." });
    }

    if (updatedData.ownerId && !mongoose.Types.ObjectId.isValid(updatedData.ownerId)) {
      return res.status(400).json({ message: "Invalid owner ID format." });
    }

    if (updatedData.ownerId) {
      const ownerExists = await User.findById(updatedData.ownerId);
      if (!ownerExists) {
        return res.status(404).json({ message: "Owner not found." });
      }
    }

    const updatedFutsal = await Futsal.findByIdAndUpdate(futsalId, updatedData, {
      new: true,
    }).populate('ownerId', 'name email');

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

    if (!mongoose.Types.ObjectId.isValid(futsalId)) {
      return res.status(400).json({ message: "Invalid futsal ID format." });
    }

    const futsal = await Futsal.findById(futsalId);
    if (!futsal) {
      return res.status(404).json({ message: 'Futsal not found' });
    }

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


//approve futsal
exports.approveFutsal = async (req, res) => {
  try {
    const futsalId = req.params.futsalId;

    if (!mongoose.Types.ObjectId.isValid(futsalId)) {
      return res.status(400).json({ message: "Invalid futsal ID format." });
    }

    const futsal = await Futsal.findById(futsalId);
    if (!futsal) {
      return res.status(404).json({ message: "Futsal not found" });
    }

    futsal.status = "approved"; // <-- update this
    futsal.isApproved = true;   // optional, only if you use this elsewhere
    await futsal.save();

    res.status(200).json({
      message: "Futsal approved successfully.",
      futsal,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error updating approval status',
      error: error.message,
    });
  }
};


exports.checkFutsalByOwner = async (req, res) => {
  const { ownerId } = req.query;

  // ✅ Instead of validating, just check if it's present
  if (!ownerId) {
    return res.status(400).json({ message: "Owner ID is required." });
  }

  try {
    const futsal = await Futsal.findOne({ ownerId });

    if (futsal) {
      return res.status(200).json({ futsalExists: true, futsal });
    } else {
      return res.status(200).json({ futsalExists: false });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error checking futsal",
      error: error.message,
    });
  }
};



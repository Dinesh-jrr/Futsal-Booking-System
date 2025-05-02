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
      documents,
      description, // ✅ Add this
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

    // ✅ Optional: Validate description length (optional but highly recommended)
    if (!description || description.length < 30) {
      return res.status(400).json({ message: "Description must be at least 20 characters long." });
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
      documents,
      description, // ✅ Save description
    });

    const savedFutsal = await newFutsal.save();

    res.status(201).json({
      message: 'Futsal created successfully!',
      futsal: savedFutsal,
    });
  } catch (error) {
    console.error('Error creating futsal:', error);
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
    const { futsalId } = req.params;
    const updateData = req.body;

    // Find and update the futsal
    const updatedFutsal = await Futsal.findByIdAndUpdate(
      futsalId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedFutsal) {
      return res.status(404).json({ success: false, message: "Futsal not found" });
    }

    res.json({ success: true, futsal: updatedFutsal });
  } catch (error) {
    console.error("Error updating futsal:", error);
    res.status(500).json({ success: false, message: "Server error" });
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

  if (!ownerId) {
    return res.status(400).json({ success: false, message: "Owner ID is required." });
  }

  try {
    const futsal = await Futsal.findOne({ ownerId });

    if (futsal) {
      return res.status(200).json({
        success: true,
        futsalExists: true,
        futsal,
      });
    } else {
      return res.status(200).json({
        success: true,
        futsalExists: false,
        futsal: null,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error checking futsal",
      error: error.message,
    });
  }
};




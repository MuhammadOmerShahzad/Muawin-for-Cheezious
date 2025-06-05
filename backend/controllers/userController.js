const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const mongoose = require('mongoose');

// Create a new user
const createUser = async (req, res) => {
  try {
    const { firstName, lastName, displayName, username, password, role, zone, branch, modules } = req.body;

    if (!firstName || !lastName || !displayName || !username || !password || !role || !zone || !branch) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const email = `${username}@cheezious.com`;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name: `${firstName} ${lastName}`,
      displayName,
      username,
      email,
      password: hashedPassword,
      plainPassword: password, // Save the plain password
      role,
      zone,
      branch,
      registeredModules: modules
    });

    await newUser.save();

    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    console.error('Error creating user:', error.stack);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

// Sign in a user
const signInUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if ((!username && !email) || !password) {
      return res.status(400).json({ message: 'Username/Email and password are required' });
    }

    // Find user by username or email
    const user = await User.findOne({
      $or: [
        { username: username || email },
        { email: email || `${username}@cheezious.com` }
      ]
    });

    if (!user) {
      console.log('Sign-in failed: User not found for username/email:', username || email);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('Sign-in attempt: User found:', user.username);

    // Ensure both data and hash are present for bcrypt.compare()
    if (!user.password) {
      console.error('Password not found for user:', username || email);
      return res.status(500).json({ message: 'Server error: Missing password data' });
    }

    // Compare plain-text password with hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      console.log('Sign-in failed: Invalid credentials for user:', user.username);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('Sign-in successful: Password is valid for user:', user.username);

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      config.jwtSecret,
      { expiresIn: '24h' }
    );

    console.log('Sign-in successful: Token generated.');

    // Construct response data, overriding for root user
    const isRootUser = user.role === 'root';

    const responseUser = {
      id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      isRoot: isRootUser,
      // Override role, zone, branch, and modules for root user
      role: isRootUser ? "Admin" : user.role,
      zone: isRootUser ? "Zone A" : user.zone,
      branch: isRootUser ? "Cheezious Headquarters" : user.branch,
      registeredModules: isRootUser ? [
        "Licenses_Trade Licenses",
        "Licenses_Staff Medicals",
        "Licenses_Tourism Licenses",
        "Licenses_Labour Licenses",
        "Approvals_Outer Spaces",
        "Vehicles_Maintenance",
        "Vehicles_Token Taxes",
        "Vehicles_Route Permits",
        "Health Safety Environment_Monthly Inspection",
        "Health Safety Environment_Quarterly Audit",
        "Health Safety Environment_Expiry of Cylinders",
        "Health Safety Environment_Incidents",
        "Health Safety Environment_Training Status",
        "Taxation_Profession Tax",
        "Taxation_Marketing / Bill Boards Taxes",
        "Certificates_Electric Fitness Test",
        "Security_Guard Training",
        "User Requests",
        "Rental Agreements",
        "Admin Policies and SOPs",
        "User Management_"
      ] : user.registeredModules,
    };

    const responseData = {
      token,
      user: responseUser,
    };

    console.log('Sign-in successful: Sending response data:', responseData);
    res.status(200).json(responseData);

  } catch (error) {
    console.error('Error during sign-in:', error.message, error.stack);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find(); // Fetch all users
    res.status(200).json(users); // Include plainPassword in the response
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a user
const updateUser = async (req, res) => {
  try {
    const { name, displayName, username, branch, role, password, zone } = req.body; // Add zone

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, displayName, username, branch, role, password, zone }, // Include zone in the update
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user's modules
const updateUserModules = async (req, res) => {
  console.log(`Request received to update modules for user: ${req.params.id}`);
  
  try {
    const { modules } = req.body;
    const userId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.log('Invalid User ID:', userId);
      return res.status(400).send({ message: 'Invalid User ID' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { registeredModules: modules },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      console.log('User not found:', userId);
      return res.status(404).send({ message: 'User not found' });
    }

    res.status(200).send({ message: 'Modules updated successfully', updatedUser });
  } catch (error) {
    console.error('Error updating modules:', error);
    res.status(500).send({ message: 'Internal server error' });
  }
};

// Delete a user
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Log the ID received
    console.log(`Received request to delete user with ID: ${id}`);

    // Ensure the ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log('Invalid user ID');
      return res.status(400).json({ message: 'Invalid user ID', status: 'error' });
    }

    // Find and delete the user
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found', status: 'error' });
    }

    console.log('User deleted successfully');
    return res.status(200).json({ message: 'User deleted successfully', status: 'success' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return res.status(500).json({ message: 'Internal server error', status: 'error' });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;
    if (!newPassword) {
      return res.status(400).json({ message: 'New password is required' });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { password: hashedPassword, plainPassword: newPassword },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'Password reset successfully', user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createUser,
  signInUser,
  getAllUsers,
  updateUser,
  updateUserModules,
  deleteUser,
  resetPassword,
}; 
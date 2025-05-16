const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const ApiError = require("../utils/apiError");
const generateToken = require("../utils/generateToken");

exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(new ApiError("Please provide all required fields", 400));
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({ name, email, password: hashedPassword });
  if (!newUser) {
    return next(new ApiError("Failed to create user", 500));
  }

  res.status(201).json({
    message: "User created successfully",
    email: newUser.email,
    name: newUser.name,
  });
});

exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ApiError("Please provide all required fields", 400));
  }

  const user = await User.findOne({ email });
  if (!user) {
    return next(new ApiError("Invalid email or password", 401));
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return next(new ApiError("Invalid email or password", 401));
  }

  const token = generateToken(user._id);
  res.status(200).json({
    message: "Login successful",
    token,
  });
});

exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).select("-password");
  if (!user) {
    return next(new ApiError("User not found", 404));
  }

  res.status(200).json({
    message: "User retrieved successfully",
    data: user,
  });
});

exports.updateMe = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;
  const { id } = req.params;

  if (!name || !email || !password) {
    return next(new ApiError("Please provide all required fields", 400));
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const updatedUser = await User.findByIdAndUpdate(
    id,
    { name, email, password: hashedPassword },
    { new: true }
  ).select("-password");

  if (!updatedUser) {
    return next(new ApiError("Failed to update user", 500));
  }

  res.status(200).json({
    message: "User updated successfully",
    data: updatedUser,
  });
});
exports.deleteMe = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const deletedUser = await User.findByIdAndDelete(id);
  if (!deletedUser) {
    return next(new ApiError("Failed to delete user", 500));
  }

  res.status(200).json({
    message: "User deleted successfully",
  });
});

exports.logout = asyncHandler(async (req, res, next) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    message: "Logout successful",
  });
});

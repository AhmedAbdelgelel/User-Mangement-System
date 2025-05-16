const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const ApiError = require("../utils/apiError");

exports.createUser = asyncHandler(async (req, res, next) => {
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

exports.getAllUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find().select("-password");
  if (!users) {
    return next(new ApiError("No users found", 404));
  }

  res.status(200).json({
    message: "Users retrieved successfully",
    data: users,
  });
});
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) {
    return next(new ApiError("User not found", 404));
  }

  res.status(200).json({
    message: "User retrieved successfully",
    data: user,
  });
});

exports.updateUser = asyncHandler(async (req, res, next) => {
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
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const deletedUser = await User.findByIdAndDelete(id);
  if (!deletedUser) {
    return next(new ApiError("Failed to delete user", 500));
  }

  res.status(200).json({
    message: "User deleted successfully",
  });
});

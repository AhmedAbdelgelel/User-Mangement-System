const User = require("../../models/userModel");
const { check } = require("express-validator");

const validatorMiddleware = require("../../middlewares/validatorMiddleware");

exports.createUserValidator = [
  check("name")
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters long"),
  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .custom(async (val) => {
      const user = await User.findOne({ email: val });
      if (user) {
        return Promise.reject(new Error("Email already in use"));
      }
    }),
  check("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  validatorMiddleware,
];
exports.getUserValidator = [
  check("id").isMongoId().withMessage("Invalid user id format"),
  validatorMiddleware,
];
exports.updateUserValidator = [
  check("id").isMongoId().withMessage("Invalid user id format"),
  check("name")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters long"),
  check("email")
    .optional()
    .isEmail()
    .withMessage("Invalid email format")
    .custom(async (val, { req }) => {
      const user = await User.findOne({ email: val });
      if (user && user._id.toString() !== req.params.id) {
        return Promise.reject(new Error("Email already in use"));
      }
    }),
  validatorMiddleware,
];
exports.deleteUserValidator = [
  check("id").isMongoId().withMessage("Invalid user id format"),
  validatorMiddleware,
];

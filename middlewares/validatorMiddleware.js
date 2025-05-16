const { validationResult } = require("express-validator");
const ApiError = require("../utils/apiError");

const validatorMiddleware = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Check if it's a custom error message (like "Email already in use")
    const errorMsg = errors.array()[0].msg || "Validation error";
    return next(new ApiError(errorMsg, 400));
  }
  next();
};

module.exports = validatorMiddleware;

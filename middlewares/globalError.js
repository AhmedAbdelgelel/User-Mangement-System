// global error handler
const ApiError = require("../utils/apiError");

const globalError = (err, req, res, next) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    error: err,
  });
  if (err.msg === "JsonWebTokenError") {
    res.status(401).json({
      status: "fail",
      message: "Invalid token, please log in again",
    });
  }
  if (err.msg === "TokenExpiredError") {
    res.status(401).json({
      status: "fail",
      message: "Token has expired, please log in again",
    });
  }
  if (err.msg === "CastError") {
    res.status(400).json({
      status: "fail",
      message: `Invalid ${err.path}: ${err.value}`,
    });
  }
  if (err.code === 11000) {
    res.status(400).json({
      status: "fail",
      message: `Duplicate field value: ${err.keyValue.email}. Please use another value!`,
    });
  }
};

module.exports = globalError;

exports.errorHandler = (err, req, res, next) => {
  console.error(err);

  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || "Internal Server Error";
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      statusCode: 400,
      message: "Validation Error",
      errors: messages,
    });
  }
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(400).json({
      success: false,
      statusCode: 400,
      message: `${field} already exists`,
    });
  }
  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      statusCode: 400,
      message: "Invalid ID format",
    });
  }
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      statusCode: 401,
      message: "Invalid token",
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      statusCode: 401,
      message: "Token has expired",
    });
  }
  if (err.isCustom) {
    return res.status(statusCode).json({
      success: false,
      statusCode,
      message,
    });
  }
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

exports.notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    statusCode: 404,
    message: `Route ${req.originalUrl} not found`,
  });
};

exports.createError = (statusCode, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.isCustom = true;
  return error;
};
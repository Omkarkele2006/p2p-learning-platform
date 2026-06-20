const errorMiddleware = (err, req, res, next) => {
  let statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  
  if (err.statusCode) {
    statusCode = err.statusCode;
  } else if (err.status) {
    statusCode = err.status;
  }

  res.status(statusCode).json({
    success: false,
    message: err.message || "Server Error"
  });
};

module.exports = errorMiddleware;

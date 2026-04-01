// This is the "Safety Net" that catches all errors in the app
module.exports = (err, req, res, next) => {
    // 1. Set default error settings if none are provided
    err.statusCode = err.statusCode || 500; // 500 means "Server Error"
    err.status = err.status || 'error';

    // 2. Send the "Hospital Report" back to the user/Postman
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        // Optional: show the stack trace only if we are in development mode
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
};
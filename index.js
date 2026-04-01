const connectDB = require('./Config/database');
const express = require('express');
const app = express();
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const AppError = require('./Utilis/AppError');
const globalErrorHandler = require('./Utilis/globalErrorHandler');

// Import Routes
const authRoutes = require('./routes/auth.Routes');
const bookRoutes = require('./routes/bookRoutes');
const studentRoutes = require('./routes/studentRoutes');
const authorRoutes = require('./routes/authorRoutes');
const librarianRoutes = require('./routes/LibrarianRoutes');

// 1. SECURITY MIDDLEWARE (Put these at the VERY TOP)
app.use(helmet()); // Protects headers
app.use(cors());   // Allows/blocks outside access

// 2. RATE LIMITING (Stop people from spamming your server)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100,
    message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use(limiter);

// 3. LOGGING (Write down who visits)
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev')); 
} else {
    app.use(morgan('combined'));
}

// 4. BODY PARSERS (Translate the guest's notes)
app.use(express.json({ limit: '10kb' })); 
app.use(express.urlencoded({ extended: true, limit: '10kb' })); 

// 5. HEALTH CHECK
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
});

// 6. ACTUAL ROUTES (The main library sections)
app.use('/auth', authRoutes);
app.use('/books', bookRoutes);
app.use('/students', studentRoutes);
app.use('/authors', authorRoutes);
app.use('/librarians', librarianRoutes);

// 7. CATCH-ALL ROUTE (For 404 - Page Not Found)
// We use '*' or '(*)' depending on your version to catch everything else
// This catches EVERYTHING that didn't match the /books, /students, etc. routes above it
app.use((req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
// 8. GLOBAL ERROR HANDLER (The Safety Net)
// This MUST be the last middleware in the file
app.use(globalErrorHandler);

// --- START THE SERVER ---
connectDB(); // Connect to MongoDB

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// --- EMERGENCY SHUTDOWN BUTTONS ---
process.on('unhandledRejection', (err) => {
    console.error('UNHANDLED REJECTION! Shutting down...');
    process.exit(1);
});

process.on('uncaughtException', (err) => {
    console.error('UNCAUGHT EXCEPTION! Shutting down...');
    process.exit(1);
});

process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    process.exit(1);
});
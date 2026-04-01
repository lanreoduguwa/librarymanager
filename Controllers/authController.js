const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Student = require('../models/student');
const Librarian = require('../models/librarian');


//admin login
exports.loginAdmin = async (req, res) => {
    try {
        console.log('Body:', req.body, 'Env User:', process.env.ADMIN_USERNAME);
        const { username, password } = req.body;
        if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '5m' });
            res.json({ token });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Error logging in admin:', error);
        res.status(500).json({ message: 'Error logging in admin', error });
    }

};


// student registration

exports.registerStudent = async (req, res) => {
    try {
        const { name, StudentId, email, password } = req.body;
        const existingStudent = await Student.findOne({ StudentId });
        if (existingStudent) {
            return res.status(400).json({ message: 'Student ID already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const student = new Student({ name, StudentId, email, password: hashedPassword });
        await student.save();
        res.status(201).json(student);
    } catch (error) {
        console.error('Error registering student:', error);
        res.status(400).json({ message: 'Error registering student', error });
    }
};

// librarian registration
exports.registerLibrarian = async (req, res) => {
    try {
        const { name, StaffID, email, password } = req.body;
        const existingLibrarian = await Librarian.findOne({ StaffID });
        if (existingLibrarian) {
            return res.status(400).json({ message: 'Staff ID already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const librarian = new Librarian({ name, StaffID, email, password: hashedPassword });
        await librarian.save();
        res.status(201).json(librarian);
    } catch (error) {
        console.error('Error registering librarian:', error);
        res.status(400).json({ message: 'Error registering librarian', error });
    }  };


// student login
exports.loginStudent = async (req, res) => {
    try {
        const { StudentId, password } = req.body;

        const student = await Student.findOne({ StudentId });
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        const isMatch = await bcrypt.compare(password, student.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: student._id }, process.env.JWT_SECRET, { expiresIn: '5m' });
        res.json({ token });
    } catch (error) {
        console.error('Error logging in student:', error);
        res.status(500).json({ message: 'Error logging in student', error });
    }
};

// librarian login
exports.loginLibrarian = async (req, res) => {
    try {
        const { StaffID, password } = req.body;
    
        const librarian = await Librarian.findOne({ StaffID });
        if (!librarian) {
            return res.status(404).json({ message: 'Librarian not found' });
        }
        const isMatch = await bcrypt.compare(password, librarian.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: librarian._id }, process.env.JWT_SECRET, { expiresIn: '5m' });
        res.json({ token });
    } catch (error) {
        console.error('Error logging in librarian:', error);
        res.status(500).json({ message: 'Error logging in librarian', error });
    }
};

// This is the missing "protect" function!
exports.protect = async (req, res, next) => {
    try {
        // 1. Get token from the header
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ message: 'You are not logged in. Please login to get access.' });
        }

        // 2. Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 3. Add the user info to the request (so other functions can use it)
        req.user = decoded;
        next(); // Move to the next function (like createBook)
    } catch (error) {
        res.status(401).json({ message: 'Invalid token or session expired' });
    }
};
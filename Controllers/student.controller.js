const Student = require('../models/student');
const AppError = require('../Utilis/AppError');

// Create a new student
exports.createStudent = async (req, res) => {
    try {
        const { name, StudentId, email } = req.body;
        const student = new Student({ name, StudentId, email });
        await student.save();
        res.status(201).json(student);
    } catch (error) {
        console.error('Error creating student:', error);
        res.status(400).json({ message: 'Error creating student', error });
    }
};
// Get all students
exports.getAllStudents = async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(400).json({ message: 'Error fetching students', error });
    }
};
// Get a single student by ID
exports.getStudentById = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.json(student);
    } catch (error) {
        res.status(400).json({ message: 'Error fetching student', error });
    }
};


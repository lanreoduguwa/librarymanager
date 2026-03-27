const Student = require('../models/student.model');
const AppError = require('../Utilis/AppError');

// Create a new student
exports.createStudent = async (req, res) => {
    try {
        const { name, studentID } = req.body;
        const Student = new student({ name, studentID });
        await Student.save();
        res.status(201).json(Student);
    } catch (error) {
        res.status(400).json({ message: 'Error creating student', error });
    }
};
// Get all students
exports.getAllStudents = async (req, res) => {
    try {
        const students = await student.find();
        res.json(students);
    } catch (error) {
        res.status(400).json({ message: 'Error fetching students', error });
    }
};
// Get a single student by ID
exports.getStudentById = async (req, res) => {
    try {
        const student = await student.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.json(student);
    } catch (error) {
        res.status(400).json({ message: 'Error fetching student', error });
    }
};


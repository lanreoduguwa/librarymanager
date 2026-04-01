const express = require('express');
const router = express.Router();

const {
    createStudent,
    getAllStudents,
    getStudentById,
} =require ('../Controllers/student.controller');

const authController = require('../Controllers/authController');

router.post('/', authController.protect, createStudent);
router.get('/', authController.protect, getAllStudents);
router.get('/:id', authController.protect, getStudentById);

module.exports = router;
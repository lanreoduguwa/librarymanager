const express = require('express');
const router = express.Router();

const {
    createStudent,
    getAllStudents,
    getStudentById,
} =require ('../Controllers/student.controller');

router.post('/students', createStudent);
router.get('/students', getAllStudents);
router.get('/students/:id', getStudentById);

module.exports = router;
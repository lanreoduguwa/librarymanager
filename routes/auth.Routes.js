const express = require('express');
const router = express.Router();


const {
    loginAdmin,
    registerStudent,
    registerLibrarian,
    loginStudent,
    loginLibrarian
} = require('../Controllers/authController');

router.post('/admin/login', loginAdmin);
router.post('/student/register', registerStudent);
router.post('/librarian/register', registerLibrarian);
router.post('/student/login', loginStudent);
router.post('/librarian/login', loginLibrarian);

module.exports = router;
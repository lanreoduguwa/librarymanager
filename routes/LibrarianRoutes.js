const express = require('express');
const router = express.Router();

const{
    createLibrarian,
    getAllLibrarians,
} = require('../Controllers/Librarian.controller');

const authController = require('../Controllers/authController');



router.post('/', authController.protect, createLibrarian);
router.get('/', authController.protect, getAllLibrarians);

module.exports = router;
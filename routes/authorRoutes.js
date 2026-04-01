const express = require('express');
const router = express.Router();

const {
    createAuthor,
    getAllAuthors,
    getAuthorById,
    updateAuthor,
    deleteAuthor
} = require('../Controllers/author.controller');

const authController = require('../Controllers/authController');

router.post('/', authController.protect, createAuthor);
router.get('/', authController.protect, getAllAuthors);
router.get('/:id', authController.protect, getAuthorById);
router.put('/:id', authController.protect, updateAuthor);
router.delete('/:id', authController.protect, deleteAuthor);



module.exports = router;
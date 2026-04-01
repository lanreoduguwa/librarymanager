const express = require('express');
const router = express.Router();

const {
    createBook,
    getAllBooks,
    getOverdueBooks,
    getBookById,
    updateBook,
    deleteBook,
    borrowBook,
    returnBook,
    searchBooks,
}= require('../Controllers/Book.controller');

const authController = require('../Controllers/authController');

router.post('/', authController.protect, createBook);
router.get('/', authController.protect, getAllBooks);
router.get('/overdue', authController.protect, getOverdueBooks);
router.get('/search/:id', authController.protect, searchBooks);
router.get('/:id', authController.protect, getBookById);
router.put('/:id', authController.protect, updateBook);
router.delete('/:id', authController.protect, deleteBook);
router.post('/:id/borrow', authController.protect, borrowBook);
router.post('/:id/return', authController.protect, returnBook);



module.exports = router;
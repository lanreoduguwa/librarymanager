const express = require('express');
const router = express.Router();
const Book = require('../models/book');

//create a new book
router.post('/books', async (req, res) => {
    try {
        const { title, authors, isbn, publicationDate, genre } = req.body;
        const book = new Book({ title, authors, isbn, publicationDate, genre });
        await book.save();
        res.status(201).json(book);
    } catch (error) {
        res.status(400).json({ message: 'Error creating book', error });
    }
});
// Get all books
router.get('/books', async (req, res) => {
    try {
        const books = await Book.find().populate('authors', 'name').populate('borrowedby', 'name').populate('issuedby', 'name');
        res.json(books);
    } catch (error) {
        res.status(400).json({ message: 'Error fetching books', error });
    }

}
);
// Get a single book by ID
router.get('/books/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id).populate('authors', 'name').populate('borrowedby', 'name').populate('issuedby', 'name');
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.json(book);
    } catch (error) {
        res.status(400).json({ message: 'Error fetching book', error });
    }
});
// Update a book by ID
router.put('/books/:id', async (req, res) => {
    try {
        const { title, authors, isbn, publicationDate, genre } = req.body;
        const book = await Book.findByIdAndUpdate(
            req.params.id,
            { title, authors, isbn, publicationDate, genre },
            { new: true }
        ).populate('authors', 'name').populate('borrowedby', 'name').populate('issuedby', 'name');
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.json(book);
    } catch (error) {
        res.status(400).json({ message: 'Error updating book', error });
    }
});
// Delete a book by ID
router.delete('/books/:id', async (req, res) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.json({ message: 'Book deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error deleting book', error });
    }
});

// Borrow a book
router.post('/books/:id/borrow', async (req, res) => {
    try {
        const { bookId, studentId, ReturnDate, librarianId } = req.body;
        if (!bookId || !studentId || !librarianId) {
            return res.status(400).json({ message: 'Book ID, Student ID, and Librarian ID are required' });
        }
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        if (book.status !== 'available') {
            return res.status(400).json({ message: 'Book is not available for borrowing' });
        }
        book.status = 'borrowed';
        book.borrowedby = studentId;
        book.issuedby = librarianId;
        await book.save();

        res.json({ message: 'Book borrowed successfully', book });
    } catch (error) {
        res.status(400).json({ message: 'Error borrowing book', error });
    }
});

// Return a book
router.post('/books/:id/return', async (req, res) => {
    try {
        const { bookId } = req.body;
        if (!bookId) {
            return res.status(400).json({ message: 'Book ID is required' });
        }
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        if (book.status !== 'borrowed') {
            return res.status(400).json({ message: 'Book is not currently borrowed' });
        }
        book.status = 'available';
        book.borrowedby = null;
        book.issuedby = null;
        await book.save();

        res.json({ message: 'Book returned successfully', book });
    } catch (error) {
        res.status(400).json({ message: 'Error returning book', error });
    }
});

// search for books by title, author, or genre
router.get('/books/search', async (req, res) => {
    try {
        const {title, author, genre} = req.query;
        let query = {};
        if (title) {
            query.title = { $regex: title, $options: 'i' };
        }
        if (author) {
            query.authors = { $in: [author] };
        }
        if (genre) {
            query.genre = { $regex: genre, $options: 'i' };
        }

        const books = await Book.find(query).populate('authors', 'name').populate('borrowedby', 'name').populate('issuedby', 'name');
        res.json(books);
    } catch (error) {
        res.status(400).json({ message: 'Error searching books', error });
    }
});


module.exports = router;
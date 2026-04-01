const express = require('express');
const Book = require('../models/book');
const Author = require('../models/author');
const Student = require('../models/student');
const Librarian = require('../models/librarian');
const AppError = require('../Utilis/AppError');


exports.borrowBook = async (req, res) => {
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
        book.issuedby = librarianId; // Assuming the librarian is the one issuing the book
        book.ReturnDate = ReturnDate; // Set the return date (you might want to calculate this based on borrowing period)

        await book.save();

        res.status(200).json({ message: 'Book borrowed successfully', book });
    } catch (error) {
        res.status(500).json({ message: 'Error borrowing book', error });
    }
};

exports.createBook = async (req, res) => {
    try {
        const { title, authors, isbn, publicationDate, genre } = req.body;
        if(!authors || authors.length === 0) {
            return res.status(400).json({ message: 'At least one author is required' });
        }
        const authorsExist = await Author.find({ _id: { $in: authors } });
        if (authorsExist.length !== authors.length) {
            return res.status(400).json({ message: 'One or more authors not found' });
        }

        const book = new Book({ title, authors, isbn, publicationDate, genre });
        await book.save();
        await book.populate('authors', 'name'); // Populate author names
        res.status(201).json({
            success: true,
            message: 'Book created successfully',
            book
        });
    } catch (error) {
        console.error('Error creating book:', error);
        res.status(400).json({ message: 'Error creating book', error });
    }
};


// Get all books
exports.getAllBooks = async (req, res) => {
    try {
        const books = await Book.find().populate('authors', 'name').populate('borrowedby', 'name').populate('issuedby', 'name');
        res.json(books);
    } catch (error) {
        console.error('Error fetching books:', error);
        res.status(400).json({ message: 'Error fetching books', error });
    }

};

exports.getOverdueBooks = async (req, res) => {
    try {
        const currentDate = new Date();
        const overdueBooks = await Book.find({
            status: 'borrowed',
            ReturnDate: { $lt: currentDate }
        }).populate('authors', 'name').populate('borrowedby', 'name').populate('issuedby', 'name');
        res.json(overdueBooks);
    } catch (error) {
        res.status(400).json({ message: 'Error fetching overdue books', error });
    }
};

// Get a single book by ID
exports.getBookById = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id).populate('authors', 'name').populate('borrowedby', 'name').populate('issuedby', 'name');
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.json(book);
    } catch (error) {
        res.status(400).json({ message: 'Error fetching book', error });
    }
};
// Update a book by ID
exports.updateBook = async (req, res) => {
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
};
// Delete a book by ID
exports.deleteBook = async (req, res) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.json({ message: 'Book deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error deleting book', error });
    }
};


// Return a book
exports.returnBook = async (req, res) => {
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
};

// search for books by title, author, or genre
exports.searchBooks = async (req, res) => {
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
};


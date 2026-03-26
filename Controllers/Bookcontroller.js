const Book = require(` ../models/book`);

exports.borrowBook = async (req, res) => {
    try {
        const { bookId, studentId, ReturnDate, librarianId } = req.body;

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


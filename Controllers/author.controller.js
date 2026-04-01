const Author = require('../models/author');
const AppError = require('../Utilis/AppError');

// Create a new author
exports.createAuthor = async (req, res) => {
    try {
        const { name, bio, dob} =req.body;
        const author = new Author({ name, bio, dob });
        await author.save();
        res.status(201).json(author);
    } catch (error) {
        res.status(400).json({ message: 'Error creating author', error });
    }
};
// Get all authors
exports.getAllAuthors = async (req, res) => {
    try {
        const authors = await Author.find();
        res.json(authors);
    } catch (error) {
        res.status(400).json({ message: 'Error fetching authors', error });
    }
};
// Get a single author by ID
exports.getAuthorById = async (req, res) => {
    try {
        const author = await Author.findById(req.params.id);
        if (!author) {
            return res.status(404).json({ message: 'Author not found' });
        }
        res.json(author);
    } catch (error) {
        res.status(400).json({ message: 'Error fetching author', error });
    }
};
// Update an author by ID
exports.updateAuthor = async (req, res) => {
    try {
        const { name, bio, dob} = req.body;
        const author = await Author.findByIdAndUpdate(
            req.params.id,
            { name, bio, dob},
            { new: true }
        );
        if (!author) {
            return res.status(404).json({ message: 'Author not found' });
        }
        res.json(author);
    } catch (error) {
        res.status(400).json({ message: 'Error updating author', error });
    }
};
// Delete an author by ID
exports.deleteAuthor = async (req, res) => {
    try {
        const author = await Author.findByIdAndDelete(req.params.id);
        if (!author) {
            return res.status(404).json({ message: 'Author not found' });
        }
        res.json({ message: 'Author deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error deleting author', error });
    }
};


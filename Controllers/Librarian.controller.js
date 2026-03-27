const Librarian = require('../models/librarian.model');
const AppError = require('../Utilis/AppError');
// Create a new librarian
exports.createLibrarian = async (req, res) => {
    try {
        const { name, StaffID } = req.body;
        const librarian = new Librarian({ name, StaffID });
        await librarian.save();
        res.status(201).json(librarian);
    } catch (error) {
        res.status(400).json({ message: 'Error creating librarian', error });
    }
};
//get all librarians
exports.getAllLibrarians = async (req, res) => {
    try {
        const librarians = await Librarian.find();
        res.json(librarians);
    } catch (error) {
        res.status(400).json({ message: 'Error fetching librarians', error });
    }
};

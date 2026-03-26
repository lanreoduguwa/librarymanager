const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Author',
        required: true
    },
    isbn: {
        type: String,
        required: true,
        unique: true
    },
    publicationDate: Date,
    genre: String
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);
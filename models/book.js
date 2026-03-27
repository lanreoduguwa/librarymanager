const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    authors: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Author',
        required: true,
        match: /^[A-Z][a-zA-Z\s]*$/ // Simple regex to ensure author names start with a capital letter and contain only letters and spaces
    }],
    status: {
        type: String, 
        enum: ['available', 'borrowed'],
        default: 'available'
    },
    isbn: {
        type: String,
        required: true,
        unique: true,
        match: /^(97(8|9))?\d{9}(\d|X)$/
    },
    borrowedby: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
    },
    issuedby:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Librarian'
    },
    ReturnDate: {
         type: Date ,
         default: null

    },
    publicationDate: { 
        type: Date ,
       genre: String },
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);
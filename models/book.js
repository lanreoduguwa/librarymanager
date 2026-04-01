const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    authors: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Author',
        required: true
    }],
    status: {
        type: String, 
        enum: ['available', 'borrowed'],
        default: 'available'
    },
    isbn: {
        type: String,
        required: true,
        unique: true
    },
    borrowedby: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        default: null
    },
    issuedby:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Librarian',
        default: null
    },
    ReturnDate: {
         type: Date ,
         default: null

    },

    genre:{
         type: String,
            enum: ['Fiction','Drama', 'Non-Fiction', 'Science Fiction', 'Biography', 'History', 'Children', 'Other'],
         },

    publicationDate: { 
        type: Date
    },
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);
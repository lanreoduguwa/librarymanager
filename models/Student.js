const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 100,
        match: /^[A-Z][a-zA-Z\s]*$/ // Simple regex to ensure names start with a capital letter and contain only letters and spaces
    },
    StudentId:{
        type: String,
        unique: true,
        required: true,
        match: /^[A-Z]{3}\d{4}$/
    },
    email:{
        type: String,
        unique: true,
        required: true,
        match: /^\S+@\S+\.\S+$/,
        lowercase: true
    },

    password: {
        type: String,
        required: true,
        minlength: 10
    },
},
{timestamps: true});

module.exports = mongoose.model('Student', studentSchema);
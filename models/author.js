const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 100
    },
    bio: String,
    dob: Date,
},
{timestamps: true});


module.exports = mongoose.model('Author', authorSchema);
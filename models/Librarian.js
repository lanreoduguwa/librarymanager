const mongoose = require("mongoose");

const librarianSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        minlength: 3,
        maxlength: 100
    },
    StaffID:{
        type: String,
        unique: true,
        required: true,
        match: /^[A-Z]{3}\d{4}$/
    },
},{
    timestamps: true
});


module.exports = mongoose.models.Librarian || mongoose.model('Librarian', librarianSchema);
const mongoose = require("mongoose");

const LibrarianSchema = new mongoose.Schema({
    name:{
        type: String,
        required:true
    },
    StaffID:{
        type: String,
        unique: true,
        required: true,
    },
},{
    timestamps : true
});
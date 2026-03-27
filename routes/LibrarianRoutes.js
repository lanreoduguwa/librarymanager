const express = require('express');
const router = express.Router();

const{
    createLibrarian,
    getAllLibrarians,
} = require('../Controllers/Librarian.controller');

router.post('/librarians', createLibrarian);
router.get('/librarians', getAllLibrarians);

module.exports = router;
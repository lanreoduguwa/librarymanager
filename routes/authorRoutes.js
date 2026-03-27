const express = require('express');
const router = express.Router();

const {
    createAuthor,
    getAllAuthors,
    getAuthorById,
    updateAuthor,
    deleteAuthor
} = require('../Controllers/author.controller');

router.post('/authors', createAuthor);
router.get('/authors', getAllAuthors);
router.get('/authors/:id', getAuthorById);
router.put('/authors/:id', updateAuthor);
router.delete('/authors/:id', deleteAuthor);



module.exports = router;
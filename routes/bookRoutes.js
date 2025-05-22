const express = require('express');
const {
    getBooks,
    getBook,
    createBook,
    updateBook,
    deleteBook
} = require('../controllers/bookController');
const { validate, createBookSchema, updateBookSchema } = require('../middleware/validation');

const router = express.Router();

router.route('/')
    .get(getBooks)
    .post(validate(createBookSchema), createBook); // Apply validation middleware

router.route('/:id')
    .get(getBook)
    .put(validate(updateBookSchema), updateBook) // Apply validation middleware
    .delete(deleteBook);

module.exports = router;
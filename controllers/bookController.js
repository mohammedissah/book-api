const Book = require('../models/bookModel');
const multer = require('multer');
const path = require('path');
const ApiFeatures = require('../utils/apiFeatures');

// Multer setup for file uploads (cover image)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Store uploaded files in the 'uploads' directory
    },
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 }, // 5MB file size limit
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb('Error: Images only!');
        }
    }
}).single('coverImage'); // 'coverImage' is the field name for the file upload

// @desc    Get all books
// @route   GET /api/v1/books
// @access  Public
exports.getBooks = async (req, res, next) => {
    try {
        const features = new ApiFeatures(Book.find(), req.query)
            .search()
            .filter()
            .sort()
            .limitFields()
            .paginate();

        const books = await features.query;

        res.status(200).json({
            success: true,
            count: books.length,
            data: books
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single book
// @route   GET /api/v1/books/:id
// @access  Public
exports.getBook = async (req, res, next) => {
    try {
        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({ success: false, error: 'Book not found' });
        }

        res.status(200).json({
            success: true,
            data: book
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Add new book
// @route   POST /api/v1/books
// @access  Private (for now, eventually add auth)
exports.createBook = (req, res, next) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ success: false, error: err });
        }

        try {
            if (req.file) {
                req.body.coverImage = `/uploads/${req.file.filename}`; // Store relative URL
            }

            const book = await Book.create(req.body);

            res.status(201).json({
                success: true,
                data: book
            });
        } catch (error) {
            next(error);
        }
    });
};

// @desc    Update book
// @route   PUT /api/v1/books/:id
// @access  Private
exports.updateBook = (req, res, next) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ success: false, error: err });
        }

        try {
            let book = await Book.findById(req.params.id);

            if (!book) {
                return res.status(404).json({ success: false, error: 'Book not found' });
            }

            if (req.file) {
                // If there's an old cover image, you might want to delete it here
                // fs.unlink(path.join(__dirname, '..', book.coverImage), (err) => { if (err) console.error(err); });
                req.body.coverImage = `/uploads/${req.file.filename}`;
            }

            book = await Book.findByIdAndUpdate(req.params.id, req.body, {
                new: true,
                runValidators: true
            });

            res.status(200).json({
                success: true,
                data: book
            });
        } catch (error) {
            next(error);
        }
    });
};


// @desc    Delete book
// @route   DELETE /api/v1/books/:id
// @access  Private
exports.deleteBook = async (req, res, next) => {
    try {
        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({ success: false, error: 'Book not found' });
        }

        // Remove the book document. Mongoose's .remove() is deprecated in favor of .deleteOne() or .deleteMany()
        await book.deleteOne(); // Or Book.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            data: {} // Return empty object for successful deletion
        });
    } catch (error) {
        next(error);
    }
};
const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true,
        unique: true // Ensure titles are unique
    },
    author: {
        type: String,
        required: [true, 'Please add an author'],
        trim: true
    },
    isbn: {
        type: String,
        required: [true, 'Please add an ISBN'],
        unique: true,
        trim: true,
        match: /^(?:ISBN(?:-13)?:?)(?=[0-9]{13}$)([0-9]{3}-){2}[0-9]{3}[0-9X]$|^[0-9]{10}$/ // Basic ISBN validation
    },
    publicationDate: {
        type: Date,
        required: [true, 'Please add a publication date']
    },
    genre: {
        type: [String], // Array of strings to allow multiple genres
        required: [true, 'Please add at least one genre'],
        enum: ['Fiction', 'Non-Fiction', 'Science Fiction', 'Fantasy', 'Mystery', 'Thriller', 'Romance', 'Horror', 'Biography', 'History', 'Self-Help', 'Childrens', 'Technology', 'Science', 'Art', 'Travel', 'Poetry', 'Business'], // Example genres
        default: ['Fiction']
    },
    coverImage: {
        type: String, // URL to the cover image
        default: 'https://via.placeholder.com/150' // Placeholder image
    },
    description: {
        type: String,
        maxlength: 1000,
        trim: true
    },
    publisher: {
        type: String,
        trim: true
    },
    pages: {
        type: Number,
        min: 1
    },
    language: {
        type: String,
        default: 'English'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Add index for search fields
bookSchema.index({ title: 'text', author: 'text', genre: 'text' });
bookSchema.index({ publicationDate: 1 }); // For sorting by date

module.exports = mongoose.model('Book', bookSchema);
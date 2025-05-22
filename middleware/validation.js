const Joi = require('joi');

// Joi schema for book creation
const createBookSchema = Joi.object({
    title: Joi.string().required().trim().min(1).max(255),
    author: Joi.string().required().trim().min(1).max(255),
    isbn: Joi.string().required().trim().pattern(/^(?:ISBN(?:-13)?:?)(?=[0-9]{13}$)([0-9]{3}-){2}[0-9]{3}[0-9X]$|^[0-9]{10}$/).messages({
        'string.pattern.base': 'ISBN must be a valid 10 or 13 digit ISBN.'
    }),
    publicationDate: Joi.date().iso().required().messages({
        'date.iso': 'Publication date must be in ISO format (e.g., YYYY-MM-DD).'
    }),
    genre: Joi.array().items(Joi.string().trim()).min(1).required(),
    description: Joi.string().max(1000).trim().optional(),
    publisher: Joi.string().trim().optional(),
    pages: Joi.number().integer().min(1).optional(),
    language: Joi.string().trim().optional(),
    coverImage: Joi.string().uri().optional() // Assuming URL for cover image
});

// Joi schema for book update (all fields optional)
const updateBookSchema = Joi.object({
    title: Joi.string().trim().min(1).max(255).optional(),
    author: Joi.string().trim().min(1).max(255).optional(),
    isbn: Joi.string().trim().pattern(/^(?:ISBN(?:-13)?:?)(?=[0-9]{13}$)([0-9]{3}-){2}[0-9]{3}[0-9X]$|^[0-9]{10}$/).messages({
        'string.pattern.base': 'ISBN must be a valid 10 or 13 digit ISBN.'
    }).optional(),
    publicationDate: Joi.date().iso().optional().messages({
        'date.iso': 'Publication date must be in ISO format (e.g., YYYY-MM-DD).'
    }),
    genre: Joi.array().items(Joi.string().trim()).min(1).optional(),
    description: Joi.string().max(1000).trim().optional(),
    publisher: Joi.string().trim().optional(),
    pages: Joi.number().integer().min(1).optional(),
    language: Joi.string().trim().optional(),
    coverImage: Joi.string().uri().optional()
});

const validate = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
        const errors = error.details.map(detail => detail.message);
        return res.status(400).json({ success: false, message: 'Validation Error', errors });
    }
    next();
};

module.exports = {
    createBookSchema,
    updateBookSchema,
    validate
};
require('dotenv').config(); // Load environment variables
const express = require('express');
const connectDB = require('./config/db');
const morgan = require('morgan'); // For logging HTTP requests
const errorHandler = require('./middleware/errorHandler');
const bookRoutes = require('./routes/bookRoutes');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./config/swagger.yaml');

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json()); // Body parser for JSON
app.use(express.urlencoded({ extended: true })); // Body parser for URL-encoded data
app.use(morgan('dev')); // HTTP request logger

// Serve static files for uploaded cover images (if storing locally)
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/v1/books', bookRoutes);

// Swagger API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Error handling middleware (should be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
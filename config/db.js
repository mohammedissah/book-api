const mongoose = require('mongoose');

const connectDB = async () => {
    try {
         console.log('Attempting to connect with MONGODB_URL:', process.env.MONGODB_URL); 
        const conn = await mongoose.connect(process.env.MONGODB_URL|| "mongodb://localhost:27017/books_db", {
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
            // useCreateIndex: true, // Deprecated in Mongoose 6+
            // useFindAndModify: false // Deprecated in Mongoose 6+
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB;
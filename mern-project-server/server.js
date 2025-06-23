require('dotenv').config();
const express = require('express'); // Include the express module
const cookieParser = require('cookie-parser');
const authRoutes = require('./src/routes/authRoutes');
const cors = require('cors');
const app = express();// Instatiate express app.

app.use(express.json());// Middleware to convert json to javascript object.
app.use(cookieParser());

const corsOptions = {
    origin: process.env.CLIENT_ENDPOINT, // This is where you want to allow requests
    credentials: true, // Allow cookies to be sent
}

app.use(cors(corsOptions)); // Use cors middleware with options

app.use('/auth', authRoutes);
const PORT = 5001;
app.listen(5001, (error) => {
    if(error){
        console.log('Error starting the server: ', error);
    } else{
        console.log('Server is running on port: ', PORT);
    }
});
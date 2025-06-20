const express = require('express'); // Include the express module
const cookieParser = require('cookie-parser');
const authRoutes = require('./src/routes/authRoutes');
const app = express();// Instatiate express app.

app.use(express.json());// Middleware to convert json to javascript object.
app.use(cookieParser());
app.use('/auth', authRoutes);
const PORT = 5001;
app.listen(5001, (error) => {
    if(error){
        console.log('Error starting the server: ', error);
    } else{
        console.log('Server is running on port: ', PORT);
    }
});
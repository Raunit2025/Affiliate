const e = require("express");
const { response } = require("express");
const jwt = require('jsonwebtoken');
const secret = "3f635806-4c5c-4d27-8f90-a0873f217694"; // https://www.uuidgenerator.net/

const authController = {
    login: (request, response) => {
        //The body contains username and password because of the express.json()
        //Middleware configured in the server.js file
        const { username, password } = request.body;

        if (username === "admin" && password === "123456") {
            const user = {
                name: 'John',
                email: 'john@example.com'
            };

            const token = jwt.sign(user, secret, { expiresIn: '1h' });
            response.cookie('jwtToken', token, {
                httpOnly: true,
                secure: true,
                domain: 'localhost',
                path: '/'
            });
            response.json({ user: user, message: 'User authenticated' });

        } else {
            response.status(401).json({ message: "Invalid credentials" });
        }

    },
    logout: (request, response) => {
        response.clearCookie('jwtToken');
        response.json({ message: "Logout successful" });
    },

    isUserLoggedIn: (request, response) => {
        const token  = request.cookies.jwtToken;

        if(!token){
            return response.status(401).json({ message: 'Unauthorized access' });
        }

        jwt.verify(token, secret, (error, user) => {
            if(error){
                return response.status(401).json({ message: 'Unauthorized access' });
            } else{
                response.json({message: 'User logged in', user: user});
            }
        });
    },
};

module.exports = authController;
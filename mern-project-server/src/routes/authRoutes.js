const express = require('express');
const authController = require('../controller/authController');
const router = express.Router(); // Instance of Router
const { body } = require('express-validator');

const loginValidator = [
    body('username')
        .notEmpty().withMessage('Username is required')
        .isEmail().withMessage('Username must be a valid email'),
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long') // Corrected: Increased min length
];

router.post('/login', loginValidator, authController.login);
router.post('/logout', authController.logout);
router.post('/is-user-logged-in', authController.isUserLoggedIn);
router.post('/register', authController.register);
router.post('/google-auth', authController.googleAuth); // Assuming this is the correct endpoint for Google auth

module.exports = router;
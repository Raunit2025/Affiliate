const express = require('express');
const authController = require('../controller/authController');
const router = express.Router();
const { body } = require('express-validator');

const loginValidator = [
    body('username')
        .notEmpty().withMessage('Username is required')
        .isEmail().withMessage('Username must be a valid email'),
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
];

const sendResetPasswordTokenValidator = [
    body('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Email must be a valid email address')
];

const resetPasswordValidator = [
    body('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Email must be a valid email address'),
    body('code')
        .notEmpty().withMessage('Reset code is required')
        .isLength({ min: 6, max: 6 }).withMessage('Reset code must be 6 digits long'),
    body('newPassword')
        .notEmpty().withMessage('New password is required')
        .isLength({ min: 8 }).withMessage('New password must be at least 8 characters long')
];

router.post('/login', loginValidator, authController.login);
router.post('/logout', authController.logout);
router.post('/is-user-logged-in', authController.isUserLoggedIn);
router.post('/register', authController.register);
router.post('/google-auth', authController.googleAuth);

// New routes for password reset
router.post('/send-reset-password-token', sendResetPasswordTokenValidator, authController.sendResetPasswordToken);
router.post('/reset-password', resetPasswordValidator, authController.resetPassword);

module.exports = router;

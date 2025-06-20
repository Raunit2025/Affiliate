const express = require('express');
const authController = require('../controller/authController');
const router = express.Router(); // Instance of Router

router.post('/login', authController.login);
router.post('/login', authController.logout);
router.post('/login', authController.isUserLoggedIn);

module.exports = router;

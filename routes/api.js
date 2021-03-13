const express = require('express');
const router = express.Router();
const passport = require('passport');
const userController = require('../controllers/userscontroller');
const authController = require('../controllers/authcontroller');

// Authenticate Using Passport
const login = passport.authenticate('local', { session: false });
const apiAuth = passport.authenticate('jwt', { session: false });

// User Routes
router.get('/', (req, res) => res.status(200).json({ status: 200, data: 'API Running' }));
router.post('/users', userController.register_post);
router.post('/users/login', login, authController.login_post);
router.get('/users/me', apiAuth, authController.me_get);

module.exports = router;

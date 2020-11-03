const express = require('express');
const router = express.Router();
const auth = require('../config/auth');
const adminController = require('../controllers/admincontroller');

/* GET users listing. */
router.get('/', auth.ensureAuthenticatedAdmin, adminController.admin_get);

/* GET - Public - Show admin log in page */
router.get('/login', adminController.login_get);

/* POST - Public - admin log */
router.post('/login', adminController.login_post);

/* GET - Public - admin log out */
router.get('/logout', auth.ensureAuthenticatedAdmin, adminController.logout_get);

module.exports = router;
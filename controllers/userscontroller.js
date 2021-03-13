const validator = require('validator');
const User = require('../models/User');
const generateToken = require('../helpers/generatetoken');

module.exports.register_post = async (req, res) => {
  try {
    // Fetch Data from Request
    const errors = [];
    const email = req.body.email ? req.body.email.trim() : '';
    const password = req.body.password ? req.body.password.trim() : '';
    const firstName = req.body.firstName ? req.body.firstName.trim() : '';
    const lastName = req.body.lastName ? req.body.lastName.trim() : '';

    // Validation
    if (validator.isEmpty(email) || validator.isEmpty(password) || validator.isEmpty(firstName) || validator.isEmpty(lastName)) {
      errors.push('firstName, lastName, email and password are required');
    }
    if (!validator.isEmail(email)) errors.push('Email is not valid');
    if (!validator.isByteLength(password, { min: 6 })) errors.push('Password must be at least 6 characters');
    let user = await User.findOne({ email });
    if (user) {
      errors.push('email already registered');
    }

    if (errors.length) {
      return res.status(400).json({ status: 400, data: errors });
    }

    // Processing
    const newUser = new User({
      firstName,
      lastName,
      email,
      password,
    });
    await newUser.save();

    res.status(200).json({ status: 200, data: generateToken(newUser) });
  } catch (error) {
    console.log('Server Error', error.stack);
    res.status(500).send('Server error');
  }
};

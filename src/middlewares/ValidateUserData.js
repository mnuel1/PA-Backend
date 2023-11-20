const validator = require('validator');

const validateUserData = (req, res, next) => {
    const { username, email, password, fullname, employment_id, office } = req.body;

    if (!validator.isEmail(email)) {
        return res.status(400).json({ title: 'Validation Error', message: 'Invalid email address' });
    }

    if (!validator.isLength(username, { min: 3, max: 50 })) {
        return res.status(400).json({ title: 'Validation Error', message: 'Username must be between 3 and 50 characters' });
    }

    if (!validator.isLength(password, { min: 8, max: 20 })) {
        return res.status(400).json({ title: 'Validation Error', message: 'Password must be between 8 and 20 characters' });
    }

    // type here the additional validation
    // if needed

    // If all validations pass, proceed to the next middleware or route handler
    next();
};

module.exports = { validateUserData };

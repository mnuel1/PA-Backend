const expressAsyncHandler = require('express-async-handler');
const connection = require('../configs/connection');
const bcrypt = require('bcrypt');
const { validateUserData } = require('../middlewares/ValidateUserData');
require('dotenv').config();


const Register = expressAsyncHandler(async (req, res) => {

    const { username, email, password, fullname, employment_id, office } = req.body;
    
    validateUserData(req, res, async () => {
        try {
            const hashedPassword = await bcrypt.hash(password, 10);

            connection.query(
                `INSERT INTO pa_admin (username, email, password, fullname,
                employment_id, office, image) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [username, email, hashedPassword, fullname, employment_id, office],
                (err, result) => {
                    if (err) {
                        console.error('Error inserting user:', err);
                        res.status(500).json({ title: 'Internal Error', message: 'Registration failed. Please try again later.' });
                    } else {
                        res.status(200).json({ title: 'Success', message: 'Registered Successfully' });
                    }
                }
            );
        } catch (error) {
            console.error('Error hashing password:', error);
            res.status(500).json({ title: 'Internal Error', message: 'Registration failed. Please try again later.' });
        }
    });
})


module.exports = { Register };
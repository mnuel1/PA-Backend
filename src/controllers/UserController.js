const expressAsyncHandler = require('express-async-handler');
const connection = require('../configs/connection');
const bcrypt = require('bcrypt');
const multer = require('multer');

const { validateUserData } = require('../middlewares/ValidateUserData');
require('dotenv').config();

// Set up multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/'); // Specify the directory where you want to store the uploaded files
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname); // Use a unique filename to avoid overwriting files
    },
});

const upload = multer({ storage: storage });


const Register = expressAsyncHandler(async (req, res) => {

    const { username, email, contact, password, fullname, employment_id, office } = req.body;
    
    validateUserData(req, res, async () => {
        try {
            const hashedPassword = await bcrypt.hash(password, 10);

            connection.query(
                `INSERT INTO pa_users (username, email, password, fullname,
                employment_id, office, contact, image, verify) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [username, email, hashedPassword, fullname, employment_id, office, contact],
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

const retrieveUsers = expressAsyncHandler(async (req, res) => {

    try {
        const queryResult = await connection.query(`SELECT * FROM pa_users WHERE verify = $1`, [false]);
        
        if (queryResult.rows) {
            const users = queryResult.rows;
            res.status(200).json({ title: 'Success', users });
        } else {
            res.status(500).json({ title: 'Something went wrong.', message: 'Please try again later.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ title: 'Internal Error', message: 'Failed to fetch users.' });
    }
    
    
})


const editUser = expressAsyncHandler(async (req, res) => {

    // Use 'upload.single' middleware to handle the file upload
    upload.single('image')(req, res, async (err) => {
        if (err) {
            return res.status(500).json({ title: 'Internal Error', message: 'Image upload failed.' });
        }

        const { user_id, username, email, contact } = req.body;
        const imagePath = req.file ? req.file.path : null; // Assuming you named the input field 'image'

        validateUserData(req, res, async () => {
            try {
                connection.query(
                `UPDATE pa_users 
                SET username = $1, email = $2, contact = $3, image = $4 
                WHERE id = $5`,
                [username, email, contact, imagePath, user_id],
                (err, result) => {
                    if (err) {
                    console.error('Error updating user:', err);
                    res.status(500).json({ title: 'Something went wrong.', message: 'Update failed. Please try again later.' });
                    } else {
                    res.status(200).json({ title: 'Success', message: 'Updated Successfully' });
                    }
                }
                );
            } catch (error) {
                res.status(500).json({ title: 'Something went wrong.', message: 'Update failed. Please try again later.' });
            }
        });
    });
})


module.exports = { 
    Register,
    retrieveUsers,
    editUser,
};
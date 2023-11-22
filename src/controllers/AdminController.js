const expressAsyncHandler = require('express-async-handler');
const connection = require('../configs/connection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { validateUserData } = require('../middlewares/ValidateUserData');
require('dotenv').config();


const Register = expressAsyncHandler(async (req, res) => {

    const { username, email, contact, password, fullname, employment_id, office } = req.body;
    
    validateUserData(req, res, async () => {
        try {
            const hashedPassword = await bcrypt.hash(password, 10);

            connection.query(
                `INSERT INTO pa_admin (username, email, password, fullname,
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

const AdminLogin = expressAsyncHandler(async (req, res) => {
    const { username, password, checked } = req.body;
    connection.query('SELECT * FROM pa_admin WHERE username = $1 AND password = $2', [username, password], (err, result) => {        
        if(err){
            res.status(500).json({title: 'Internal Error', message: err.message});
        }
        if(result.rows.length > 0){
            const { id, fullname} = result.rows[0]; // Assuming the primary key is named 'id'
            const token = jwt.sign(
                {username: username, user_id: id, fullname: fullname, role: 'admin'},
                process.env.JWT_TOKEN,
                {expiresIn: checked ? '1d': '7d'}
            )
            res.status(200).json({title: "Success", message: "Login Successful", token: token, username: username, user_id: id, fullname: fullname, role: 'admin'});
        
        }else{
            res.status(401).json({title: "Login Error" ,message: "Credentials Incorrect"})
        }
    })
})



module.exports = { Register, AdminLogin };
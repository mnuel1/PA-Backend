const expressAsyncHandler = require('express-async-handler');
const connection = require('../configs/connection');
const { sendNotification } = require('./NotificationController');
require('dotenv').config();

const Verified = expressAsyncHandler(async (req, res) => {
    const { user_id, verify } = req.body;
       
    connection.query('UPDATE pa_users SET verify = $1 WHERE id = $2', [verify, user_id], (err, result) => { 
        if (err) {                   
            
            res.status(500).json({ title: 'Something went wrong.', message: `Verification failed. Please try again later..` });
        } else {
            sendNotification(user_id, "0", true,
                "Congratulations! 🎉 You are now verified!",
                "",
                res);            
        }
    
    })
})



module.exports = { Verified }
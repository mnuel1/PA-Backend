const expressAsyncHandler = require('express-async-handler');
const connection = require('../configs/connection');
const { sendNotification } = require('./NotificationController');
require('dotenv').config();

const Verified = expressAsyncHandler(async (req, res) => {
    const { user_id, verify } = req.body;
    console.log(user_id);
    console.log(verify);

    connection.query('UPDATE pa_users SET verify = $1 WHERE id = $2', [verify, user_id], (err, result) => { 
        if (err) {                   
            
            res.status(500).json({ title: 'Something went wrong.', message: `Verification failed. Please try again later..` });
        } else {
            // sendNotification(req,res);
            res.status(200).json({ title: 'SUCCESS.', message: `YOURE VERIFIED NOW` });
        }
    
    })
})



module.exports = { Verified }
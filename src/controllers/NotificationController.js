const expressAsyncHandler = require('express-async-handler');
const connection = require('../configs/connection');
require('dotenv').config();


const sendNotification = expressAsyncHandler(async (req, res) => {

    const { user_id, message } = req.body;

    connection.query(
        `INSERT INTO pa_users_notification (user_id, message, "read", created_at) VALUES ($1, $2, $3, $4)`,
        [user_id, message, false, new Date()],
        (err, result) => {
            if (err) {
                console.error(err.message);
                res.status(500).json({ title: 'Something went wrong.', message: 'Please try again later.' });
            } else {                
                res.status(200).json({ title: 'Successful.', message: 'Congrats.' });
            }
        }
    );

})

const modifyNotification = expressAsyncHandler(async (req, res) => {

    const { user_id, notif_id } = req.body;
       
    connection.query(`UPDATE pa_users_notification 
    SET read = $1 
    WHERE user_id = $2 
    AND id = $3`,[true, user_id, notif_id],(err,ressult) => {

        if (err) {
            console.error(err.message);
            res.status(500).json({ title: 'Something went wrong.', message: 'Please try again later.' });
        } else {
            
            res.status(200).json({ title: 'Successful.', message: 'congrats.' });
        }

    })            
})

const retrieveNotification = expressAsyncHandler(async (req, res) => {
    const { user_id } = req.body;
  
    try {
      // Retrieve notifications and user information
      const queryResult = await connection.query(
        `SELECT n.*, u.username FROM pa_users_notification n 
        JOIN pa_users u ON n.user_id = u.id 
        WHERE n.user_id = $1 
        ORDER BY n.created_at DESC`,


        [user_id],
      );
  
      const notifications = queryResult.rows;
  
      res.status(200).json({ title: 'Success', notifications });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ title: 'Something went wrong', message: 'Failed to retrieve notifications.' });
    }

});
  
  

module.exports = {
    sendNotification,
    modifyNotification,
    retrieveNotification,
};
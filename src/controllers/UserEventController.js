const expressAsyncHandler = require('express-async-handler');
const connection = require('../configs/connection');
require('dotenv').config();


const viewEvents = expressAsyncHandler(async (req, res) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    try {
        const queryResult = await connection.query(`SELECT * FROM pa_events`);
        
        if (queryResult.rows) {
            const events = queryResult.rows;
            res.status(200).json({ title: 'Success', events });
        } else {
            res.status(500).json({ title: 'Something went wrong.', message: 'Please try again later.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ title: 'Something went wrong', message: 'Failed to fetch events.' });
    }
})

const viewParticipants = expressAsyncHandler(async (req, res) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    try {
        const { event_id } = req.query; // Assuming event_id is passed in the URL parameters
       
        const queryResult = await connection.query(`
            SELECT u.*
            FROM pa_users u
            INNER JOIN pa_users_events ue ON u.id = ue.user_id
            WHERE ue.event_id = $1
        `, [event_id]);
        
        if (queryResult.rows) {
            // console.log(queryResult);
            const users = queryResult.rows;
            res.status(200).json({ title: 'Success', users });
        } else {
            res.status(500).json({ title: 'Something went wrong.', message: 'Please try again later.' });
        }
     
    } catch (error) {
        console.error(error);
        res.status(500).json({ title: 'Something went wrong', message: 'Failed to fetch participants.' });
    }

})


module.exports = {
    viewEvents,
    viewParticipants
}


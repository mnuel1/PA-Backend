const expressAsyncHandler = require('express-async-handler');
const connection = require('../configs/connection');
require('dotenv').config();


const viewEvents = expressAsyncHandler(async (req, res) => {
   
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
    
    try {
        const { eventId } = req.body; // Assuming eventId is passed in the URL parameters

        // Use INNER JOIN to get users assigned to a specific event
        const queryResult = await connection.query(`
            SELECT u.*
            FROM pa_users u
            INNER JOIN pa_users_events ue ON u.id = ue.user_id
            WHERE ue.event_id = $1
        `, [eventId]);
        
        if (queryResult.rows) {
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


const expressAsyncHandler = require('express-async-handler');
const connection = require('../configs/connection');
require('dotenv').config();

const userViewEvents = expressAsyncHandler(async (req, res) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    try {
        // Assuming you have the user ID in the request (you may need to adjust this part)
        const {user_id} = req.query;
        
        // Use INNER JOIN to get only the events assigned to the user
        const queryResult = await connection.query(`
            SELECT pe.*, pue.starred
            FROM pa_events pe
            INNER JOIN pa_users_events pue ON pe.id = pue.event_id
            INNER JOIN pa_users_notification pun ON pe.id = pun.event_id
            WHERE pue.user_id = $1
            AND pun.user_id = $1
            AND pun.invitation = true;
        `, [user_id]);

        if (queryResult.rows) {
            const events = queryResult.rows;
            res.status(200).json({ title: 'Success', events });
        } else {
            res.status(404).json({ title: 'No events found', message: 'No events assigned to the user.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ title: 'Something went wrong', message: 'Failed to fetch events.' });
    }
});


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

const starredEvent = expressAsyncHandler(async (req, res) => {

    try {
        const {user_id, event_id, starred} = req.body

        connection.query(`UPDATE pa_users_events SET starred = $3
        WHERE user_id = $1 AND event_id = $2`,[user_id, event_id, starred], (err, result) => {

            if (err) {
                res.status(500).json({ title: 'Something went wrong.', message: 'Please try again later.' });   
            } else {
                res.status(200).json({ title: 'Success',});
            }
        })
    }catch (error) {
        console.error(error);
        res.status(500).json({ title: 'Something went wrong', message: 'Failed to fetch participants.' });
    }

})

const createAttendance = expressAsyncHandler(async (req, res) => {
    try {
        const {user_id, events_id, comments, attend} = req.body;

        connection.query(`INSERT INTO pa_users_attendance 
        (user_id, event_id, comments, attend) VALUES ($1, $2, $3, $4)`,
        [user_id, events_id, comments, false], (err, result) => {
            if (err) {
                res.status(500).json({ title: 'Something went wrong.', message: 'Please try again later.' });   
            } else {
                res.status(200).json({ title: 'Success',});
            }
        })
    }catch(error) {
        console.error(error);
        res.status(500).json({ title: 'Something went wrong', message: 'Failed to fetch participants.' });
    }
})


module.exports = {
    viewEvents,
    viewParticipants,
    userViewEvents,
    starredEvent,
    createAttendance
}


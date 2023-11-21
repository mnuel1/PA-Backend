const expressAsyncHandler = require('express-async-handler');
const connection = require('../configs/connection');
require('dotenv').config();



const createEvent = expressAsyncHandler(async (req,res) => {

    const {title, description, dateTime, location, reminder} = req.body;

    connection.query(`INSERT INTO pa_events (title, description, 
        dateNTime, location, reminder) VALUES ($1, $2, $3, $4, $5)`,
        [title, description, dateTime, location, reminder],(err,result) => {
            if (err) {
                console.error('Error inserting event:', err);
                res.status(500).json({ title: 'Something went wrong', message: 'Creating event failed. Please try again later.' });
            } else {
                res.status(200).json({ title: 'Success', message: 'Event Created' });
            }
    })

})

const editEvent = expressAsyncHandler(async (req,res) => {

    const {event_id, title, description, dateTime, location, reminder} = req.body;

    connection.query(`UPDATE pa_events 
    SET title = $2, description = $3, dateNTime = $4, 
    location = $5, reminder = $6 WHERE id = $1`, 
    [event_id, title, description, dateTime, location, reminder],
        (err,result) => {
            if (err) {
                console.error('Error inserting event:', err);
                res.status(500).json({ title: 'Something went wrong', message: 'Edit failed. Please try again later.' });
            } else {
                res.status(200).json({ title: 'Success', message: 'Edit done' });
            }
    })
})

const deleteEvent = expressAsyncHandler(async (req,res) => {
    
    try {
        const { event_id } = req.body;

        // Delete the event from pa_events table
        const deleteEventResult = await connection.query(`
            DELETE FROM pa_events
            WHERE id = $1
        `, [event_id]);

        // Check if the event was successfully deleted
        if (deleteEventResult.rowCount > 0) {
            res.status(200).json({ title: 'Success', message: 'Event deleted successfully.' });
        } else {
            res.status(404).json({ title: 'Not Found', message: 'Event not found.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ title: 'Something went wrong', message: 'Failed to delete event.' });
    }
    

})

const addParticipant = expressAsyncHandler(async (req,res) => {

    const { user_ids, event_id } = req.body;

    // Create an array of placeholders for the user_ids
    const user_idPlaceholders = user_ids.map((id, index) => `($${index + 1}, $${user_ids.length + 1})`).join(', ');

    // Flatten the user_ids array and add the event_id at the end
    const queryValues = [].concat(...user_ids, event_id);

    // Construct and execute the INSERT query
    connection.query(
        `INSERT INTO pa_users_events (user_id, event_id) VALUES ${user_idPlaceholders}`,
        queryValues,
        (err, result) => {
            if (err) {
                console.error('Error adding participants:', err);
                res.status(500).json({ title: 'Something went wrong', message: 'Adding participants failed. Please try again later.' });
            } else {
                res.status(200).json({ title: 'Success', message: 'Participants added' });
            }
        }
    );
})

const removeParticipant = expressAsyncHandler(async (req,res) => {

    const { user_ids, event_id } = req.body;

    // Convert the user_ids array to a string with placeholders for the query
    const user_idPlaceholders = user_ids.map((id, index) => `$${index + 1}`).join(', ');

    // Construct and execute the DELETE query with the IN clause
    connection.query(
        `DELETE FROM pa_users_events WHERE user_id IN (${user_idPlaceholders}) AND event_id = $${user_ids.length + 1}`,
        [...user_ids, event_id],
        (err, result) => {
            if (err) {
                console.error('Error removing participants:', err);
                res.status(500).json({ title: 'Something went wrong', message: 'Removing participants failed. Please try again later.' });
            } else {
                res.status(200).json({ title: 'Success', message: 'Participants removed' });
            }
        }
    );


})


module.exports = {
    createEvent, editEvent, deleteEvent,     
    addParticipant, removeParticipant
}
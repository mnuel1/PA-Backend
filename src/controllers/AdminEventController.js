const expressAsyncHandler = require('express-async-handler');
const connection = require('../configs/connection');
require('dotenv').config();




const addParticipant = expressAsyncHandler(async (req, res) => {
    const { user_ids, event_id } = req.body;

    const user_idsArray = user_ids.split(',').map(id => id.trim());
    
    const user_idPlaceholders = user_idsArray.map((_, index) => `($${index + 1}, $${user_idsArray.length + 1})`).join(', ');

    const queryValues = [].concat(...user_idsArray, event_id);
    
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
});

const updateParticipant = expressAsyncHandler (async (req, res) => {

    const { user_ids, event_id } = req.body;
    const user_idsArray = user_ids.split(',').map(id => id.trim());

    try {
        // Begin the transaction
        await connection.query('BEGIN');
      
        // Step 1: Delete existing records for the given event_id
        await connection.query('DELETE FROM pa_users_events WHERE event_id = $1', [event_id]);
      
        // Step 2: Insert new records based on the provided user_ids and event_id
        const user_idPlaceholders = user_idsArray.map((_, index) => `($${index + 1}, $${user_idsArray.length + 1})`).join(', ');
        const queryValues = [].concat(...user_idsArray, event_id);
      
        await connection.query(
          `INSERT INTO pa_users_events (user_id, event_id) VALUES ${user_idPlaceholders}`,
          queryValues
        );
      
        // Commit the transaction if everything is successful
        await connection.query('COMMIT');
      
        res.status(200).json({ title: 'Success', message: 'Participants updated successfully' });

      } catch (error) {

        await connection.query('ROLLBACK');
        console.error('Error updating participants:', error);
        res.status(500).json({ title: 'Error', message: 'Failed to update participants. Please try again later.' });
      }


});
  

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

const createEvent = expressAsyncHandler(async (req, res) => {
    const { event, description, datetime, location, reminder, participants } = req.body;    
    connection.query(
        `INSERT INTO pa_events (event, description, dateTime, location, reminder) VALUES ($1, $2, $3, $4, $5) RETURNING id`,
        [event, description, datetime, location, datetime],
        (err, result) => {
            if (err) {
                console.error('Error inserting event:', err);
                res.status(500).json({ title: 'Something went wrong', message: 'Creating event failed. Please try again later.' });
            } else {
            
                if (result.rows.length > 0) {
                    const { id } = result.rows[0];            
                    res.status(200).json({ title: 'Success', message: 'Event Created', id });
                } else {
                    console.error('Unexpected result:', result);
                    res.status(500).json({ title: 'Unexpected Error', message: 'An unexpected error occurred. Please try again later.' });
                }
            }
        }
    );
});


const editEvent = expressAsyncHandler(async (req,res) => {

    const {id, event, description, datetime, location, reminder, participants} = req.body;
    
    connection.query(`UPDATE pa_events 
    SET event = $2, description = $3, datetime = $4, 
    location = $5, reminder = $6 WHERE id = $1 RETURNING id`, 
    [id, event, description, datetime, location, datetime],
        (err,result) => {
            if (err) {
                console.error('Error inserting event:', err);
                res.status(500).json({ title: 'Something went wrong', message: 'Edit failed. Please try again later.' });
            } else {
                
                if (result.rows.length > 0) {
                    const { id } = result.rows[0];                                
                    res.status(200).json({ title: 'Success', message: 'Edit done', id });
                } else {
                    console.error('Unexpected result:', result);
                    res.status(500).json({ title: 'Unexpected Error', message: 'An unexpected error occurred. Please try again later.' });
                }
            }
    })
})

const deleteEvent = expressAsyncHandler(async (req,res) => {
    
    try {
        const { event_id } = req.query;

        console.log(event_id);
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


module.exports = {
    createEvent, editEvent, deleteEvent,     
    addParticipant, updateParticipant, removeParticipant
}
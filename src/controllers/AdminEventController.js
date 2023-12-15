const expressAsyncHandler = require("express-async-handler");
const connection = require("../configs/connection");
const { sendNotification } = require("./NotificationController");
require("dotenv").config();

const addParticipant = expressAsyncHandler(async (req, res) => {
  const { user_ids, event_id, event_title, datetime, location } = req.body;

  const user_idsArray = user_ids.split(",").map((id) => id.trim());

  const user_idPlaceholders = user_idsArray
    .map((_, index) => `($${index + 1}, $${user_idsArray.length + 1})`)
    .join(", ");

  const queryValues = [].concat(...user_idsArray, event_id);

  connection.query(
    `INSERT INTO pa_users_events (user_id, event_id) VALUES ${user_idPlaceholders}`,
    queryValues,
    (err, result) => {
      if (err) {
        console.error("Error adding participants:", err);
        res.status(500).json({
          title: "Something went wrong",
          message: "Adding participants failed. Please try again later.",
        });
      } else {
        sendNotification(
          user_idsArray,
          event_id,
          false,
          `We are inviting you to join us!
                    Event: ${event_title}
                    Date: ${datetime}
                    Location: ${location}`,
          "",
          res
        );
        // res.status(200).json({ title: 'Success', message: 'Participants added' });
      }
    }
  );
});

const updateParticipant = expressAsyncHandler(async (req, res) => {
  const { user_ids, event_id } = req.body;
  const user_idsArray = user_ids.split(",").map((id) => id.trim());

  try {
    // Begin the transaction
    await connection.query("BEGIN");

    // Step 1: Delete existing records for the given event_id
    await connection.query("DELETE FROM pa_users_events WHERE event_id = $1", [
      event_id,
    ]);

    // Step 2: Insert new records based on the provided user_ids and event_id
    const user_idPlaceholders = user_idsArray
      .map((_, index) => `($${index + 1}, $${user_idsArray.length + 1})`)
      .join(", ");
    const queryValues = [].concat(...user_idsArray, event_id);

    await connection.query(
      `INSERT INTO pa_users_events (user_id, event_id) VALUES ${user_idPlaceholders}`,
      queryValues
    );

    // Commit the transaction if everything is successful
    await connection.query("COMMIT");

    res
      .status(200)
      .json({ title: "Success", message: "Participants updated successfully" });
  } catch (error) {
    await connection.query("ROLLBACK");
    console.error("Error updating participants:", error);
    res.status(500).json({
      title: "Error",
      message: "Failed to update participants. Please try again later.",
    });
  }
});

const removeParticipant = expressAsyncHandler(async (req, res) => {
  const { user_ids, event_id } = req.body;

  // Convert the user_ids array to a string with placeholders for the query
  const user_idPlaceholders = user_ids
    .map((id, index) => `$${index + 1}`)
    .join(", ");

  // Construct and execute the DELETE query with the IN clause
  connection.query(
    `DELETE FROM pa_users_events WHERE user_id IN (${user_idPlaceholders}) AND event_id = $${
      user_ids.length + 1
    }`,
    [...user_ids, event_id],
    (err, result) => {
      if (err) {
        console.error("Error removing participants:", err);
        res.status(500).json({
          title: "Something went wrong",
          message: "Removing participants failed. Please try again later.",
        });
      } else {
        res
          .status(200)
          .json({ title: "Success", message: "Participants removed" });
      }
    }
  );
});

const createEvent = expressAsyncHandler(async (req, res) => {
  const {
    event,
    description,
    datetime,
    location,
    reminder,
    participants,
    is_important,
    document,
  } = req.body;
  connection.query(
    `INSERT INTO pa_events (event, description, dateTime, location, reminder, is_important, document) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
    [event, description, datetime, location, datetime, is_important, document],
    (err, result) => {
      if (err) {
        console.error("Error inserting event:", err);
        res.status(500).json({
          title: "Something went wrong",
          message: "Creating event failed. Please try again later.",
        });
      } else {
        if (result.rows.length > 0) {
          const { id } = result.rows[0];
          res
            .status(200)
            .json({ title: "Success", message: "Event Created", id });
        } else {
          console.error("Unexpected result:", result);
          res.status(500).json({
            title: "Unexpected Error",
            message: "An unexpected error occurred. Please try again later.",
          });
        }
      }
    }
  );
  console.log("Important: ", is_important);
});

const editEvent = expressAsyncHandler(async (req, res) => {
  const {
    id,
    event,
    description,
    datetime,
    location,
    reminder,
    participants,
    is_important,
    document,
  } = req.body;

  connection.query(
    `UPDATE pa_events 
   SET event = $2, description = $3, datetime = $4, 
   location = $5, reminder = $6, is_important = $7, document = $8 
   WHERE id = $1 RETURNING id`,
    [
      id,
      event,
      description,
      datetime,
      location,
      datetime,
      is_important,
      document,
    ],
    (err, result) => {
      if (err) {
        console.error("Error inserting event:", err);
        res.status(500).json({
          title: "Something went wrong",
          message: "Edit failed. Please try again later.",
        });
      } else {
        if (result.rows.length > 0) {
          const { id } = result.rows[0];
          res.status(200).json({ title: "Success", message: "Edit done", id });
          console.log("Important: ", is_important);
        } else {
          console.error("Unexpected result:", result);
          res.status(500).json({
            title: "Unexpected Error",
            message: "An unexpected error occurred. Please try again later.",
          });
        }
      }
    }
  );
});

const deleteEvent = expressAsyncHandler(async (req, res) => {
  try {
    const { event_id } = req.query;

    // Delete the event from pa_events table
    const deleteEventResult = await connection.query(
      `
            DELETE FROM pa_events
            WHERE id = $1
        `,
      [event_id]
    );

    // Check if the event was successfully deleted
    if (deleteEventResult.rowCount > 0) {
      res
        .status(200)
        .json({ title: "Success", message: "Event deleted successfully." });
    } else {
      res.status(404).json({ title: "Not Found", message: "Event not found." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      title: "Something went wrong",
      message: "Failed to delete event.",
    });
  }
});

const getAttendees = expressAsyncHandler(async (req, res) => {
  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, private"
  );
  try {
    const { event_id } = req.query; // Assuming event_id is passed in the URL parameters
    const queryResult = await connection.query(
      `
            SELECT
                a.id AS attendance_id,
                a.user_id,
                a.comments,
                u.*,
                e.*
            FROM
                pa_users_attendance a
            JOIN
                pa_users u ON a.user_id = u.id
            JOIN
                pa_events e ON a.event_id = e.id
            WHERE 
                a.event_id = $1
                AND a.attend = false;
        `,
      [event_id]
    );

    if (queryResult.rows) {
      const users = queryResult.rows;
      res.status(200).json({ title: "Success", users });
    } else {
      res.status(500).json({
        title: "Something went wrong.",
        message: "Please try again later.",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      title: "Something went wrong",
      message: "Failed to fetch participants.",
    });
  }
});

const presentAbsentAttendee = expressAsyncHandler(async (req, res) => {
  const { user_id, event_id, attend } = req.body;

  try {
    connection.query(
      `UPDATE pa_users_attendance
        SET attend = $1
        WHERE user_id = $2 AND event_id = $3`,
      [attend, user_id, event_id],
      (err, result) => {
        if (err) {
          console.error("Error inserting event:", err);
          res.status(500).json({
            title: "Something went wrong",
            message: "Edit failed. Please try again later.",
          });
        } else {
          res.status(200).json({ title: "Success", message: "Edit done" });
        }
      }
    );
  } catch (error) {
    console.error("Unexpected result:", error);
    res.status(500).json({
      title: "Unexpected Error",
      message: "An unexpected error occurred. Please try again later.",
    });
  }
});

const getReport = expressAsyncHandler(async (req, res) => {
  try {
    const queryResult = await connection.query(`SELECT pr.*, pe.*
        FROM pa_reports pr
        INNER JOIN pa_events pe ON pr.event_id = pe.id;`);

    if (queryResult.rows) {
      const reports = queryResult.rows;
      res.status(200).json({ title: "Success", reports });
    } else {
      res.status(500).json({
        title: "Something went wrong.",
        message: "Please try again later.",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      title: "Something went wrong",
      message: "Failed to fetch participants.",
    });
  }
});

const createReport = expressAsyncHandler(async (req, res) => {
  const { event_id, endTime, narrative } = req.body;
  connection.query(
    `INSERT INTO pa_reports (event_id, endTime, narrative) VALUES ($1, $2, $3) RETURNING id`,
    [event_id, endTime, narrative],
    (err, result) => {
      if (err) {
        console.error("Error inserting event:", err);
        res.status(500).json({
          title: "Something went wrong",
          message: "Creating event failed. Please try again later.",
        });
      } else {
        if (result.rows.length > 0) {
          const { id } = result.rows[0];
          res
            .status(200)
            .json({ title: "Success", message: "Event Created", id });
        } else {
          console.error("Unexpected result:", result);
          res.status(500).json({
            title: "Unexpected Error",
            message: "An unexpected error occurred. Please try again later.",
          });
        }
      }
    }
  );
});

const deleteReport = expressAsyncHandler(async (req, res) => {
  try {
    let { event_id } = req.query;
    event_id = Number(event_id);
    if (isNaN(event_id)) {
      return res.status(400).json({
        title: "Bad Request",
        message: "Invalid event_id. Please provide a valid number.",
      });
    }

    const deleteReportResult = await connection.query(
      `DELETE FROM pa_reports WHERE event_id = $1`,
      [event_id]
    );

    if (deleteReportResult.rowCount > 0) {
      res
        .status(200)
        .json({ title: "Success", message: "Report deleted successfully." });
    } else {
      res
        .status(404)
        .json({ title: "Not Found", message: "Report not found." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      title: "Something went wrong",
      message: "Failed to delete report.",
    });
  }
});

const getPresents = expressAsyncHandler(async (req, res) => {
  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, private"
  );
  try {
    const { event_id } = req.query; // Assuming event_id is passed in the URL parameters
    const queryResult = await connection.query(
      `
            SELECT
                a.id AS attendance_id,
                a.user_id,
                u.*,
                e.*
            FROM
                pa_users_attendance a
            JOIN
                pa_users u ON a.user_id = u.id
            JOIN
                pa_events e ON a.event_id = e.id
            WHERE 
                a.event_id = $1
                AND a.attend = true;
        `,
      [event_id]
    );

    if (queryResult.rows) {
      const users = queryResult.rows;
      res.status(200).json({ title: "Success", users });
    } else {
      res.status(500).json({
        title: "Something went wrong.",
        message: "Please try again later.",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      title: "Something went wrong",
      message: "Failed to fetch participants.",
    });
  }
});

const getAbsents = expressAsyncHandler(async (req, res) => {
  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, private"
  );
  try {
    const { event_id } = req.query; // Assuming event_id is passed in the URL parameters
    const queryResult = await connection.query(
      `
            SELECT
                a.id AS attendance_id,
                a.user_id,
                u.*,
                e.*
            FROM
                pa_users_attendance a
            JOIN
                pa_users u ON a.user_id = u.id
            JOIN
                pa_events e ON a.event_id = e.id
            WHERE 
                a.event_id = $1
                AND a.attend = false;
        `,
      [event_id]
    );

    if (queryResult.rows) {
      const users = queryResult.rows;
      res.status(200).json({ title: "Success", users });
    } else {
      res.status(500).json({
        title: "Something went wrong.",
        message: "Please try again later.",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      title: "Something went wrong",
      message: "Failed to fetch participants.",
    });
  }
});

module.exports = {
  createEvent,
  editEvent,
  deleteEvent,
  addParticipant,
  updateParticipant,
  removeParticipant,
  presentAbsentAttendee,
  getAttendees,
  createReport,
  deleteReport,
  getReport,
  getPresents,
  getAbsents,
};

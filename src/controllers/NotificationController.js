const expressAsyncHandler = require("express-async-handler");
const connection = require("../configs/connection");
require("dotenv").config();

const sendNotification = expressAsyncHandler(
  async (user_idsArray, event_id, read, message, comment, res) => {
    try {
      // Fetch the is_important value from pa_events table
      const eventResult = await connection.query(
        `SELECT is_important FROM pa_events WHERE id = $1`,
        [event_id]
      );

      if (eventResult.rows.length > 0) {
        const isImportant = eventResult.rows[0].is_important;

        for (const user_id of user_idsArray) {
          await connection.query(
            `INSERT INTO pa_users_notification (user_id, event_id, message, "read", 
                invitation, comment, created_at, is_important) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
            [
              user_id,
              event_id,
              message,
              read,
              false,
              comment,
              new Date(),
              isImportant,
            ]
          );
        }

        res.status(200).json({ title: "Successful.", message: "Congrats." });
      } else {
        res.status(404).json({
          title: "Not Found",
          message: "Event not found.",
        });
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).json({
        title: "Something went wrong.",
        message: "Please try again later.",
      });
    }
  }
);

const modifyNotification = expressAsyncHandler(async (req, res) => {
  const { user_id, notif_id } = req.body;

  connection.query(
    `UPDATE pa_users_notification 
    SET read = $1 
    WHERE user_id = $2 
    AND id = $3`,
    [true, user_id, notif_id],
    (err, ressult) => {
      if (err) {
        console.error(err.message);
        res.status(500).json({
          title: "Something went wrong.",
          message: "Please try again later.",
        });
      } else {
        res.status(200).json({ title: "Successful.", message: "congrats." });
      }
    }
  );
});

const retrieveNotification = expressAsyncHandler(async (req, res) => {
  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, private"
  );
  const { user_id } = req.query;

  try {
    // Retrieve notifications and user information
    const queryResult = await connection.query(
      `SELECT n.*, u.username FROM pa_users_notification n 
        JOIN pa_users u ON n.user_id = u.id 
        WHERE n.user_id = $1 AND n.invitation = false 
        ORDER BY n.created_at DESC`,

      [user_id]
    );

    const notifications = queryResult.rows;
    // console.log(notifications);
    res.status(200).json({ title: "Success", notifications });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      title: "Something went wrong",
      message: "Failed to retrieve notifications.",
    });
  }
});
const deleteUserEventNotifications = async (user_id, event_id) => {
  await connection.query(
    "DELETE FROM pa_admin_notification WHERE user_id = $1 AND event_id = $2",
    [user_id, event_id]
  );
};
const stateNotification = expressAsyncHandler(async (req, res) => {
  const { user_id, event_id, invitation, comment } = req.body;

  // Assuming you pass user_id, event_id, invitation, and comment in the request body
  try {
    // Update the invitation status
    await connection.query(
      "UPDATE pa_users_notification SET invitation = $1, comment = $2 WHERE user_id = $3 AND event_id = $4",
      [invitation, comment, user_id, event_id]
    );

    // Before inserting new records, delete previous records with the same user_id and event_id
    await deleteUserEventNotifications(user_id, event_id);

    // Insert into pa_admin_notification
    await connection.query(
      "INSERT INTO pa_admin_notification (user_id, event_id, message, read, invitation) VALUES ($1, $2, $3, $4, $5)",
      [user_id, event_id, comment, false, invitation || null]
    );

    res.status(200).json({ title: "Successful.", message: "congrats." });
  } catch (error) {
    console.error("Error inserting notification:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

const retrieveAdminNotification = expressAsyncHandler(async (req, res) => {
  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, private"
  );
  try {
    const queryResult = await connection.query(
      `SELECT n.id AS notification_id, n.user_id, u.*,
            e.*, n.message, n.read, n.invitation, n.created_at
            FROM pa_admin_notification n
            JOIN pa_users u ON n.user_id = u.id
            JOIN pa_events e ON n.event_id = e.id;
          `
    );

    const notifications = queryResult.rows;

    res.status(200).json({ title: "Success", notifications });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      title: "Something went wrong",
      message: "Failed to retrieve notifications.",
    });
  }
});
module.exports = {
  sendNotification,
  modifyNotification,
  retrieveNotification,
  stateNotification,
  retrieveAdminNotification,
};

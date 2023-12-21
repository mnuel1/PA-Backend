const expressAsyncHandler = require("express-async-handler");
const connection = require("../configs/connection");
require("dotenv").config();

const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

const userViewEvents = expressAsyncHandler(async (req, res) => {
  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, private"
  );
  try {
    // Assuming you have the user ID in the request (you may need to adjust this part)
    const { user_id } = req.query;

    // Use INNER JOIN to get only the events assigned to the user
    const queryResult = await connection.query(
      `
            SELECT pe.*, pue.starred
            FROM pa_events pe
            INNER JOIN pa_users_events pue ON pe.id = pue.event_id
            INNER JOIN pa_users_notification pun ON pe.id = pun.event_id
            WHERE pue.user_id = $1
            AND pun.user_id = $1
            AND pun.invitation = true;
        `,
      [user_id]
    );

    if (queryResult.rows) {
      const events = queryResult.rows;
      res.status(200).json({ title: "Success", events });
    } else {
      res.status(404).json({
        title: "No events found",
        message: "No events assigned to the user.",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      title: "Something went wrong",
      message: "Failed to fetch events.",
    });
  }
});

const viewEvents = expressAsyncHandler(async (req, res) => {
  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, private"
  );
  try {
    const queryResult = await connection.query(`SELECT * FROM pa_events`);

    if (queryResult.rows) {
      const events = queryResult.rows;
      res.status(200).json({ title: "Success", events });
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
      message: "Failed to fetch events.",
    });
  }
});

const deleteUserEvent = expressAsyncHandler(async (req, res) => {
  console.log("DELETE /deleteUserEvent route hit");
  const { user_id, event_id } = req.query;
  console.log("user_id:", user_id, "event_id:", event_id);

  connection.query(
    `DELETE FROM pa_users_events 
       WHERE user_id = $1 AND event_id = $2`,
    [user_id, event_id],
    (err, result) => {
      if (err) {
        console.error("Error removing user event:", err);
        res.status(500).json({
          title: "Something went wrong",
          message: "Removing user event failed. Please try again later.",
        });
      } else if (result.rowCount > 0) {
        res
          .status(200)
          .json({ title: "Success", message: "User event removed" });
      } else {
        res
          .status(404)
          .json({ title: "Not found", message: "User event not found" });
      }
    }
  );
});

const viewParticipants = expressAsyncHandler(async (req, res) => {
  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, private"
  );
  try {
    const { event_id } = req.query; // Assuming event_id is passed in the URL parameters

    const queryResult = await connection.query(
      `
            SELECT u.*
            FROM pa_users u
            INNER JOIN pa_users_events ue ON u.id = ue.user_id
            WHERE ue.event_id = $1
        `,
      [event_id]
    );

    if (queryResult.rows) {
      // console.log(queryResult);
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

const starredEvent = expressAsyncHandler(async (req, res) => {
  try {
    const { user_id, event_id, starred } = req.body;

    connection.query(
      `UPDATE pa_users_events SET starred = $3
        WHERE user_id = $1 AND event_id = $2`,
      [user_id, event_id, starred],
      (err, result) => {
        if (err) {
          res.status(500).json({
            title: "Something went wrong.",
            message: "Please try again later.",
          });
        } else {
          res.status(200).json({ title: "Success" });
        }
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({
      title: "Something went wrong",
      message: "Failed to fetch participants.",
    });
  }
});

const createAttendance = expressAsyncHandler(async (req, res) => {
  // Use 'upload.single' middleware to handle the file upload
  upload.single("image")(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      return res
        .status(500)
        .json({ title: "Internal Error", message: "Image upload failed." });
    } else {
      try {
        const { user_id, events_id, comments, attend } = req.body;
        const imagePath = req.file ? req.file.path : null;
        console.log("imagePath:", imagePath);

        connection.query(
          `DELETE FROM pa_users_attendance WHERE user_id = $1 AND event_id = $2`,
          [user_id, events_id],
          (deleteErr, deleteResult) => {
            if (deleteErr) {
              return res.status(500).json({
                title: "Something went wrong.",
                message: "Failed to delete existing data.",
              });
            }
            connection.query(
              `INSERT INTO pa_users_attendance 
                          (user_id, event_id, comments, attend, image) VALUES ($1, $2, $3, $4, $5)`,
              [user_id, events_id, comments, false, imagePath],
              (insertErr, insertResult) => {
                if (insertErr) {
                  return res.status(500).json({
                    title: "Something went wrong.",
                    message: "Failed to insert new data.",
                  });
                }

                res.status(200).json({ title: "Success" });
              }
            );
          }
        );
      } catch (error) {
        console.error(error);
        res.status(500).json({
          title: "Something went wrong",
          message: "Failed to fetch participants.",
        });
      }
    }
  });
});

module.exports = {
  viewEvents,
  deleteUserEvent,
  viewParticipants,
  userViewEvents,
  starredEvent,
  createAttendance,
};

const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");

// CONTROLLERS
const userController = require("./src/controllers/UserController");
const adminController = require("./src/controllers/AdminController");
const verificationController = require("./src/controllers/VerificationController");
const notificationController = require("./src/controllers/NotificationController");
const userEventController = require("./src/controllers/UserEventController");
const adminEventController = require("./src/controllers/AdminEventController");

const connection = require("./src/configs/connection");
require("dotenv").config();

const port = process.env.PORT || 4000;

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post("/upload", upload.single("file"), (req, res) => {
  const filePath = req.file.path.replace(/\\/g, "/");
  res.json({
    message: "File uploaded successfully",
    filePath: filePath.replace(/\//g, "\\"),
  });
});

app.post("/adminlogin", adminController.AdminLogin);
app.patch("/editAdmin", adminController.editAdmin);

app.post("/userlogin", userController.Login);
app.post("/register", userController.Register);
app.get("/retrieveVUsers", userController.retrieveVerifiedUsers);
app.get("/retrieveNVUsers", userController.retrieveNotVerifiedUsers);
app.patch("/editUser", userController.editUser);
app.delete("/deleteUser", userController.deleteUser);

app.patch("/verify", verificationController.Verified);

app.post("/sendNotification", notificationController.sendNotification);
app.patch("/setNotifRead", notificationController.modifyNotification);
app.get("/getNotifications", notificationController.retrieveNotification);

app.get(
  "/getAdminNotification",
  notificationController.retrieveAdminNotification
);

// user
app.patch("/stateNotification", notificationController.stateNotification);

app.get("/userViewEvents", userEventController.userViewEvents);
app.get("/getEvents", userEventController.viewEvents);
app.get("/getParticipant", userEventController.viewParticipants);
app.patch("/starredEvent", userEventController.starredEvent);
app.delete("/deleteUserEvent", userEventController.deleteUserEvent);

app.post("/createAttendance", userEventController.createAttendance);

app.post("/createEvent", adminEventController.createEvent);
app.patch("/editEvent", adminEventController.editEvent);
app.delete("/deleteEvent", adminEventController.deleteEvent);

app.post("/createReport", adminEventController.createReport);
app.delete("/deleteReport", adminEventController.deleteReport);
app.get("/getReports", adminEventController.getReport);

app.post("/addParticipant", adminEventController.addParticipant);
app.put("/updateParticipants", adminEventController.updateParticipant);
app.delete("/removeParticipant", adminEventController.removeParticipant);

// attendees
app.patch("/updateAttendee", adminEventController.presentAbsentAttendee);
app.get("/getAttendees", adminEventController.getAttendees);

app.get("/getPresents", adminEventController.getPresents);
app.get("/getAbsents", adminEventController.getAbsents);

app.get("/retrieveAdmin/:id", adminController.retrieveAdmin);
app.get("/retrieveUser/:id", userController.retrieveUser);

app.get("/adminImage/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await connection.query(
      "SELECT image FROM pa_admin WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Image not found" });
    }
    const { image } = result.rows[0];

    res.json({ image: "/" + image });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/userImage/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await connection.query(
      "SELECT image FROM pa_users WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Image not found" });
    }
    const { image } = result.rows[0];

    res.json({ image: "/" + image });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/attendanceImage/:id", async (req, res) => {
  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, private"
  );
  const { id } = req.params;

  try {
    const result = await connection.query(
      "SELECT image FROM pa_users_attendance WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Image not found" });
    }
    const { filename, image } = result.rows[0];

    res.set("Content-Type", "image/*");

    res.send(image);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/file/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await connection.query(
      "SELECT document FROM pa_events WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "document not found" });
    }
    const { document } = result.rows[0];

    // Send the document as a response
    res.setHeader("Content-disposition", `attachment; filename=file`);
    res.setHeader("Content-type", "application/pdf");
    res.send(document);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

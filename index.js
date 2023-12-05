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
  res.json({ message: "File uploaded successfully" });
});

app.post("/adminlogin", adminController.AdminLogin);
app.patch("/editAdmin", adminController.editAdmin);

app.post("/userlogin", userController.Login);
app.post("/register", userController.Register);
app.get("/retrieveVUsers", userController.retrieveVerifiedUsers);
app.get("/retrieveNVUsers", userController.retrieveNotVerifiedUsers);
app.patch("/editUser", userController.editUser);

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

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

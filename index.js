const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');

// CONTROLLERS
const userController = require('./src/controllers/UserController')
const verificationController = require('./src/controllers/VerificationController')
const notificationController = require('./src/controllers/NotificationController')

const connection = require('./src/configs/connection');
require('dotenv').config();

const port = process.env.PORT || 4000; 

app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const multer = require('multer');


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post('/upload', upload.single('file'), (req, res) => {
  res.json({ message: 'File uploaded successfully' });
});



app.post('/register', userController.Register);
app.get('/getUsers',userController.retrieveUsers);
app.patch('/editUser',userController.editUser);

app.patch('/verify',verificationController.Verified);

app.post('/sendNotification',notificationController.sendNotification);
app.patch('/setNotifRead',notificationController.modifyNotification);
app.get('/getNotifications',notificationController.retrieveNotification);

app


app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
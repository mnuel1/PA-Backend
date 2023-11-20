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



app.post('/register', userController.Register);

app.patch('/verify',verificationController.Verified);

app.post('/sendNotification',notificationController.sendNotification);
app.patch('/setNotifRead',notificationController.modifyNotification);
app.get('/getNotifications',notificationController.retrieveNotification);



app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
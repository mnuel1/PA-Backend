const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');

// CONTROLLERS
const userController = require('./src/controllers/UserController')
const verificationController = require('./src/controllers/VerificationController')

const connection = require('./src/configs/connection');
require('dotenv').config();

app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 4000; 


app.post('/register', userController.Register);

app.patch('/verify',verificationController.Verified);


app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
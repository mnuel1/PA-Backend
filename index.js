const express = require('express');
const app = express();

const morgan = require('morgan');
const cors = require('cors');

const connection = require('./src/configs/connection');
require('dotenv').config();

const port = process.env.PORT || 4000; // Use process.env to access environment variables


// Check database connection
connection
  .query('SELECT NOW() as now')
  .then(result => {
    console.log('Connected to PostgreSQL database at:', result.rows[0].now);
  })
  .catch(error => {
    console.error('Error connecting to PostgreSQL database', error);
  });


app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
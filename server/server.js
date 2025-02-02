// server.js (Node.js with Express)
const express = require('express');
const cors = require('cors'); // cross-origin resource sharing
const { Pool } = require('pg'); // Postgress connection
const app = express();
require('dotenv').config({path: __dirname + '/secrets.env' }); // Include .env file


app.use(cors()); // Handle cross site requests
app.use(express.json()); // Middleware to parse JSON bodies


// Create connection pool using enviroment variables
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});


// Test the connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Database connected successfully:', res.rows[0]);
  }
});





app.post('/api/sign-in', (req, res) => {
  const { user, pass } = req.body; // The data sent from your React frontend
  // Process the data and send a response
  console.log('Received login request:');
  console.log('Username:', user);
  console.log('Password:', pass);

  const results = pool.query('SELECT * from users where username=$1', [user]);
  console.log(results);

  res.json({ message: 'Request received!', user, pass });
});

app.listen(5000, () => {
  console.log('Server running on port 5000');
});

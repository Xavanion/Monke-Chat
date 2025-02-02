// server.js (Node.js with Express)
const express = require('express');
const cors = require('cors'); // cross-origin resource sharing
const { Pool } = require('pg'); // Postgress connection
const app = express();
const bcrypt = require('bcrypt'); // Encryption + Salting
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





app.post('/api/sign-in', async (req, res) => {
  const { user, pass } = req.body; // The data sent from your React frontend
  // Process the data and send a response
  console.log('Received login request:');
  console.log('Username:', user);
  console.log('Password:', pass);

  try {
    res.json({ message: 'Request received!', user, pass });
    const results = await pool.query('SELECT * from users where username=$1', [user]);
    // Add password with salt and hash it compare against stored hash and then 
    console.log(results.rows);

    // Check to make sure table isn't empty
    if (results.rows.length > 0){
      const hashedPassword = await bcrypt.hash(pass, results.rows[0].salt);
      if ( hashedPassword == results.rows[0].password_hash ) {
        console.log('Password Correct');
        // Add generation/sending back of JWT token
      } else {
        // Ask again/feedback to user
        console.log('Password Incorrect');
      }
    }
  } catch (error){
    console.error ('Error finding user: ', error);
    res.status(500).json({ message: 'Internal server error'})
  }
});


app.post('/api/create-account', async (req, res) => {
  const { user, pass, email } = req.body;
  console.log('Recieved create request: ');
  console.log('User:', user);
  console.log('Pass:', pass);
  console.log('Email:', email);

  try {
    // Generate Salt
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);

    // Hash Password with Salt
    const hashedPassword = await bcrypt.hash(pass, salt);

    // Insert User into database
    const results = await pool.query('INSERT INTO users (username, password_hash, salt, email) VALUES ($1, $2, $3, $4)', [user, hashedPassword, salt, email]);
    console.log(results);
    res.json({ message: 'Account created successfully: ', user, email});
  } catch (error){
    console.error('Error Creating account: ', error);
    res.status(500).json({ message: 'Internal server error' })
  }
});

app.listen(5000, () => {
  console.log('Server running on port 5000');
});

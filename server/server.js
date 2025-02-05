// server.js (Node.js with Express)
const express = require('express');
const app = express();
const cors = require('cors'); // cross-origin resource sharing
const { Pool } = require('pg'); // Postgress connection
const bcrypt = require('bcrypt'); // Encryption + Salting
const { SignJWT, jwtVerify} = require('jose');

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

const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization']; // Grab whole header
  const token = authHeader && authHeader.split(' ')[1]; // Grab token from header

  // Return unauthorized if token not present
  if (token == null) return res.sendStatus(401);


  try{
    const { payload } = jwtVerify(token, secretKey); // Verify token
    req.user = payload; // Send back payload
    next(); // Go to next middleware
  } catch (error){
    console.error('JWT Verification Failed', error);
    return res.sendStatus(403);
  }
}

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
  console.log('Received login request:'); //REMOVE
  console.log('Username:', user);
  console.log('Password:', pass);

  try {
    const results = await pool.query('SELECT * from users where username=$1', [user]);
    // Add password with salt and hash it compare against stored hash and then 
    console.log(results.rows); // REMOVE

    // Check to make sure table isn't empty
    if (results.rows.length > 0){
      const hashedPassword = await bcrypt.hash(pass, results.rows[0].salt);
      if ( hashedPassword == results.rows[0].password_hash ) {
        console.log('Password Correct'); // REMOVE
        // Generation of JWT Token
        const token = await new SignJWT({ username: user })
          .setProtectedHeader({ alg: 'HS256' })
          .setIssuedAt()
          .setExpirationTime('4h')
          .sign(secretKey);

        // Send back token + message
        return res.json({ message: 'Login Successful', token });
      } else {
        console.log('Password Incorrect'); // REMOVE
        return res.status(401).json({ message: 'Invalid Credentials' })
      }
    } else{
        return res.status(404).json({ message: 'User not found' })
    }
  } catch (error){
    console.error ('Error finding user: ', error);
    return res.status(500).json({ message: 'Internal server error'})
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
    res.json({ message: 'Account created successfully: ', user, email });
  } catch (error){
    console.error('Error Creating account: ', error);
    res.status(500).json({ message: 'Internal server error' })
  }
});


app.get('/api/protected', authenticateToken, (req, res) => {
  // This route is protected and can only be accessed with a valid JWT
  res.json({ message: 'This is a protected route', user: req.user });
});



app.listen(5000, () => {
  console.log('Server running on port 5000');
});

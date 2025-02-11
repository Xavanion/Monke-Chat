// server.js (Node.js with Express)
const express = require('express');
const app = express();
const cors = require('cors'); // cross-origin resource sharing
const { Pool } = require('pg'); // Postgress connection
const bcrypt = require('bcrypt'); // Encryption + Salting
const cookieParser = require('cookie-parser'); // Cookies
const { SignJWT, jwtVerify} = require('jose');
const io = require("socket.io")(3000);

require('dotenv').config({path: __dirname + '/secrets.env' }); // Include .env file


app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
); // Handle cross site requests
app.use(express.json()); // Middleware to parse JSON bodies
app.use(cookieParser()); // Middleware to parse cookies


io.on("connection", socket => {
  console.log(socket.id)
});



// Create connection pool using enviroment variables
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);


// Verifies JWT Token
const authenticateToken = async (req, res, next) => {
  const token = req.cookies['jwt']; // Grab token from cookie
  if ( !token ) {
    return res.status(401).json( { message: 'Access Denied' } );
  }

  try{
    const { payload } = await jwtVerify(token, secretKey); // Verify token
    req.user = payload; // Send back payload
    next(); // Go to next middleware
  } catch ( error ){
    return res.status(403).json({ message: 'Invalid Token' });
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
  
  // Process the data and send a respon
  try {
    const results = await pool.query('SELECT * from users where username=$1', [user]);

    // Check to make sure table isn't empty
    if ( results.rowCount.length === 0 ) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Validate Password
    const storedHash = results.rows[0].password_hash;
    const isValid = await bcrypt.compare(pass, storedHash);
    
    if ( !isValid ) {
      return res.status(401).json({ message: 'Invalid Credentials' })
    }

    // Generation of JWT Token
    const payload = { username: user};
    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('4h')
      .sign(secretKey);


    // Store JWT in cookie
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: false,
      maxAge: 14400000,
      sameSite: 'strict',
    });

    
    return res.json({ message: 'Login Successful'});
  } catch (error){
    return res.status(500).json({ message: 'Internal server error'})
  }
});

app.post('/api/logout', async (req, res) => {
  res.clearCookie('jwt', {
    httpOnly: true,
    secure: false,  // Change to `true` in production
    sameSite: 'strict',
  });

  res.status(200).json({ message: 'Logged out successfully' });
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
    const results = await pool.query('INSERT INTO users (username, password_hash, email) VALUES ($1, $2, $3)', [user, hashedPassword, email]);
    console.log(results);
    res.json({ message: 'Account created successfully: ', user, email });
  } catch (error){
    console.error('Error Creating account: ', error);
    res.status(500).json({ message: 'Internal server error' })
  }
});

app.get('/api/username', authenticateToken, async (req, res) => {
  res.status(200).json({user: req.user.username})
});

app.get('/api/verify', authenticateToken, async (req, res) => {
  // This route is protected and can only be accessed with a valid JWT
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.status(200).json({ user: req.user });
});



app.listen(5000, () => {
  console.log('Server running on port 5000');
});

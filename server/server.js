// server.js (Node.js with Express)
const express = require('express');
const app = express();
const cors = require('cors'); // cross-origin resource sharing
const { Pool } = require('pg'); // Postgress connection
const bcrypt = require('bcrypt'); // Encryption + Salting
const cookieParser = require('cookie-parser'); // Cookies
const { SignJWT, jwtVerify} = require('jose');
const { Server } = require("socket.io");
const http = require('http');
const { type } = require('os');
const server = http.createServer(app);
require('dotenv').config({path: __dirname + '/secrets.env' }); // Include .env file

// Handle cross site requests
app.use(cors({ 
    origin: "http://localhost:5173",
    credentials: true,
  })
); 
app.use(express.json()); // Middleware to parse JSON bodies
app.use(cookieParser()); // Middleware to parse cookies


// Create connection pool using enviroment variables
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});


// Socket.io Server
const io = new Server(server,{
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  }
});


// Socket.IO Server
io.on("connection", socket => {
  console.log("User connected: ", socket.id);

  // User comes online
  socket.on('online', (socket) => {
    io.emit('online', (username));
  });
  
  // User sends a message
  socket.on('sendMessage', ({ username, message, roomId }) => {
    console.log("Received message:", message, "From:", username, "In room:", roomId); // TODO: Store in DB
    io.to(roomId).emit('receiveMessage', { username: `${username}`, message: `${message}` }); // Change to group/dm based
  });

  // User Joins a room
  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  // User Leaves a room
  socket.on('leaveRoom', (roomId) => {
    socket.leave(roomId);
    console.log(`User ${socket.id} left room ${roomId}`);
  });


  // User Disconnects
  socket.on('disconnect', () => {
    console.log('User disconnected: ', socket.id);
  });
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


// Add's message to Database
const addMessage = async (messageData) => {
  const {sender_id, receiver_id, content, roomId} = messageData;
  try{
    await pool.query('INSERT INTO direct_messages (sender_id, receiver_id, content) VALUES ($1, $2, $3)', [sender_id, receiver_id, content]);
  } catch(error){
    console.error('Error adding message to database:', error);
    throw error;
  }
}


// Fetch Past messages
app.get('/api/messages/:roomId', async (req, res) => {
  const { roomId } = req.params;
  try {
      const result = await pool.query(
          `SELECT sender_id, content, timestamp 
           FROM direct_messages 
           WHERE (sender_id = $1 AND receiver_id = $2) 
              OR (sender_id = $2 AND receiver_id = $1) 
           ORDER BY timestamp ASC`,
          roomId.split('-') // Extract sender_id and receiver_id from roomId
      );
      res.json(result.rows);
  } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ error: "Failed to fetch messages" });
  }
});




// Create message handler
app.post('/api/message', authenticateToken, async (req, res) => {
  try {
    const { sender_id, receiver_id, content, roomId } = req.body;
    await addMessage( {sender_id, receiver_id, content, roomId} );

    console.log("RoomId:", roomId, "\nContent:", content);
    // emit event to send message data to connected clients
    io.to(roomId).emit('chat message', content);
    res.status(201).send();
  } catch (err) {
    console.error(err)
    res.status(500).send();
  }
});


// Returns rows of all friends
app.get('/api/friendList', authenticateToken, async (req, res) => {
  try{
    const result = await pool.query(
      `SELECT u.id, u.username
       FROM users u
       JOIN friends f ON u.id = f.friend_id
       WHERE f.user_id = $1
       UNION
       SELECT u.id, u.username
       FROM users u
       JOIN friends f ON u.id = f.user_id
       WHERE f.friend_id = $1`,
      [req.user.uid]
    );

    res.status(200).json({ friends: result.rows });
  } catch(error){
    console.error("Error Retrieving Friends:", error);
    return res.status(500).json({message: "Error Retrieving Friend List"});
  }
});


// Add friend to list
app.post('/api/friendRequest', async (req, res) => {
  const { user, friend, userId } = req.body;
  if(!user || !friend || !userId){
    return res.status(400).json({message: 'Internal server error: Missing request data'});
  }

  if(user === friend){
    return res.status(400).json({message:"User can't friend themselves"})
  }

  try{
    const friendResults = await pool.query('SELECT id from users where username=$1', [friend]);
    if (friendResults.rowCount === 0){
      return res.status(404).json({message: "Friend not found"});
    }
    const friendID = friendResults.rows[0].id;
    const [lowerID, upperID] = userId < friendID ?  [userId, friendID] : [friendID, userId];

    // Check to see if already friends if not add if so return
    const friendCheck = await pool.query('SELECT * FROM friends WHERE user_id=$1 and friend_id=$2', [lowerID, upperID]);
    if (friendCheck.rowCount > 0){
      return res.status(409).json({message: "Friend already added"});
    }

    try{
      const results = await pool.query('INSERT INTO friends (user_id, friend_id) VALUES ($1, $2)', [lowerID, upperID]);
      console.log('Friend Request sent to:', friend);
      return res.status(201).json({message: "Added friend successfully"});
    } catch(error){
      console.error('Error adding Friend:', error);
      return res.status(500).json({message: 'Internal Server Error, Adding friend'});
    }
    
  } catch(error){
    return res.status(500).json({message: 'Internal server error, friend request'})
  }
});


// Sign in/verify account
app.post('/api/sign-in', async (req, res) => {
  const { user, pass } = req.body; // The data sent from your React frontend
  let lowerUser = user.toLowerCase();
  console.log("Password Sign in:", pass);
  console.log("User Sign in:", user)
  // Process the data and send a respon
  try {
    const results = await pool.query('SELECT * from users where username=$1', [lowerUser]);
    // Check to make sure table isn't empty
    if ( results.rowCount === 0 ) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Validate Password
    const storedHash = results.rows[0].password_hash;
    const isValid = await bcrypt.compare(pass, storedHash);
    
    if ( !isValid ) {
      return res.status(401).json({ message: 'Invalid Credentials' })
    }
    // Generation of JWT Token
    const payload = { username: lowerUser, uid: results.rows[0].id};

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
  let lowerUser = user.toLowerCase();

  try {
    // Generate Salt
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);

    // Hash Password with Salt
    const hashedPassword = await bcrypt.hash(pass, salt);

    // Insert User into database
    const results = await pool.query('INSERT INTO users (username, password_hash, email) VALUES ($1, $2, $3)', [lowerUser, hashedPassword, email]);
    res.json({ message: 'Account created successfully: ', lowerUser, email });
  } catch (error){
    console.error('Error Creating account: ', error);
    res.status(500).json({ message: 'Internal server error' })
  }
});

// Gets user/id from authenticateToken middleware
app.get('/api/username', authenticateToken, async (req, res) => {
  return res.status(200).json({user: req.user.username, uid: req.user.uid})
});

app.get('/api/verify', authenticateToken, async (req, res) => {
  // This route is protected and can only be accessed with a valid JWT
  res.status(200).json({ user: req.user.username });
});


server.listen(5000, () => {
  console.log('Server running on port 5000');
});

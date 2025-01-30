// server.js (Node.js with Express)
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors()); // Handle cross site requests
app.use(express.json()); // Middleware to parse JSON bodies


app.post('/api/sign-in', (req, res) => {
  const { user, pass } = req.body; // The data sent from your React frontend
  // Process the data and send a response
  console.log('Received login request:');
  console.log('Username:', user);
  console.log('Password:', pass);

  res.json({ message: 'Request received!', user, pass });
});

app.listen(5000, () => {
  console.log('Server running on port 5000');
});

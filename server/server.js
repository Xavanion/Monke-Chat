// server.js (Node.js with Express)
const express = require('express');
const app = express();

app.use(express.json()); // Middleware to parse JSON bodies

app.post('/api/your-endpoint', (req, res) => {
  const data = req.body; // The data sent from your React frontend
  // Process the data and send a response
  res.json({ message: 'Request received!', data });
});

app.listen(5000, () => {
  console.log('Server running on port 5000');
});

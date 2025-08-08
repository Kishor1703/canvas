const express = require('express');
const cors = require('cors');
const app = express();
const canvasRoutes = require('./routes/canvasRoutes');
const PORT = 5000;

// CORS middleware for all routes
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://canvasbuilder-flax.vercel.app');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Credentials', 'true');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use('/api/canvas', canvasRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

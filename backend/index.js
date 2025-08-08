const express = require('express');
const cors = require('cors');
const app = express();
const canvasRoutes = require('./routes/canvasRoutes');
const PORT = 5000;

// Update CORS to allow your frontend origin explicitly
app.use(cors({
  origin: 'https://canvasbuilder-flax.vercel.app', // <-- your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
}));

app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use('/api/canvas', canvasRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const express = require('express');
const cors = require('cors');
const app = express();
const canvasRoutes = require('./routes/canvasRoutes');
const PORT = 5000;

const allowedOrigins = [
  'http://localhost:3000',
'https://canvasbuilder-flax.vercel.app/',
'https://canvas-kappa-six.vercel.app'
];


const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use('/api/canvas', canvasRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

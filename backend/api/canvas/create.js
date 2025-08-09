export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://canvasbuilder-flax.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method === 'POST') {
    // Your canvas creation logic here
    res.status(200).json({ message: 'Canvas created' });
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
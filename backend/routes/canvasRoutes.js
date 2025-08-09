const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const { createCanvasAPI, addElementAPI, exportPDFAPI } = require('../controllers/canvasController');

// Create canvas
router.post('/create', createCanvasAPI);

// Add element
router.post('/add', upload.single('image'), addElementAPI);

// Export to PDF
router.get('/export', exportPDFAPI);

module.exports = router;

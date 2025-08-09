
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { loadImage } = require('canvas');
const PDFDocument = require('pdfkit');

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.post('/api/canvas/create', async (req, res) => {
    try {
        const { imageData } = req.body;
        if (!imageData) {
            return res.status(400).json({ error: 'No image data provided' });
        }

        const doc = new PDFDocument({ autoFirstPage: false });
        let buffers = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
            const pdfData = Buffer.concat(buffers);
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename=canvas.pdf');
            res.send(pdfData);
        });

        const img = await loadImage(imageData);
        doc.addPage({ size: [img.width, img.height] });
        doc.image(imageData, 0, 0);
        doc.end();

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error while creating PDF' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;

const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const PDFDocument = require('pdfkit');

let canvas, ctx;
let elements = [];  // Store drawing instructions

exports.createCanvasAPI = (req, res) => {
    const { width, height } = req.body;
    canvas = createCanvas(width, height);
    ctx = canvas.getContext('2d');
    elements = [];  // Reset
    res.json({ message: 'Canvas created', width, height });
};

exports.addElementAPI = async (req, res) => {
    const { type, x, y, width, height, radius, text, color, fontSize, imageUrl } = req.body;
    elements.push({ type, x, y, width, height, radius, text, color, fontSize, imageUrl, file: req.file });
    res.json({ message: 'Element added', element: req.body });
};

exports.exportPDFAPI = async (req, res) => {
    // Redraw all elements on canvas
    for (let el of elements) {
        ctx.fillStyle = el.color || 'black';
        switch (el.type) {
            case 'rectangle':
                ctx.fillRect(el.x, el.y, el.width, el.height);
                break;
            case 'circle':
                ctx.beginPath();
                ctx.arc(el.x, el.y, el.radius, 0, Math.PI * 2);
                ctx.fill();
                break;
            case 'text':
                ctx.font = `${el.fontSize || 16}px Arial`;
                ctx.fillText(el.text, el.x, el.y);
                break;
            case 'image':
                try {
                    const image = await loadImage(el.imageUrl || `./${el.file.path}`);
                    ctx.drawImage(image, el.x, el.y, el.width, el.height);
                } catch (err) {
                    console.error('Image error:', err);
                }
                break;
        }
    }

    // Convert to image and then to PDF
    const imgBuffer = canvas.toBuffer('image/png');
    const doc = new PDFDocument({ autoFirstPage: false });

    const filename = 'canvas_export.pdf';
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    doc.pipe(res);
    doc.addPage({ size: [canvas.width, canvas.height] });
    doc.image(imgBuffer, 0, 0);
    doc.end();
};

const { createCanvas, loadImage } = require('canvas');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const state = { canvas: null, ctx: null, width: 0, height: 0, elements: [] };

exports.createCanvasAPI = (req, res) => {
  try {
    const { width, height } = req.body;
    if (!width || !height) return res.status(400).json({ error: 'width and height required' });
    state.width = Number(width);
    state.height = Number(height);
    state.canvas = createCanvas(state.width, state.height);
    state.ctx = state.canvas.getContext('2d');
    state.elements = [];
    state.ctx.fillStyle = '#ffffff';
    state.ctx.fillRect(0, 0, state.width, state.height);
    return res.json({ message: 'Canvas created', width: state.width, height: state.height });
  } catch (err) {
    console.error('createCanvasAPI error', err);
    return res.status(500).json({ error: 'Failed to create canvas' });
  }
};

exports.addElementAPI = async (req, res) => {
  try {
    const body = req.body || {};
    const file = req.file;
    const el = {
      type: body.type,
      x: Number(body.x) || 0,
      y: Number(body.y) || 0,
      width: Number(body.width) || 0,
      height: Number(body.height) || 0,
      radius: Number(body.radius) || 0,
      text: body.text || '',
      color: body.color || '#000000',
      fontSize: Number(body.fontSize) || 16,
      imageUrl: body.imageUrl || '',
      filePath: file ? file.path : null,
    };
    if (!el.type) return res.status(400).json({ error: 'type is required' });
    state.elements.push(el);
    return res.json({ message: 'Element added', element: el });
  } catch (err) {
    console.error('addElementAPI error', err);
    return res.status(500).json({ error: 'Failed to add element' });
  }
};

async function redrawAll() {
  if (!state.canvas || !state.ctx) throw new Error('Canvas not initialized');
  const ctx = state.ctx;
  ctx.clearRect(0, 0, state.width, state.height);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, state.width, state.height);
  for (const el of state.elements) {
    try {
      ctx.fillStyle = el.color || '#000000';
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
          ctx.font = `${el.fontSize}px sans-serif`;
          ctx.textBaseline = 'top';
          ctx.fillText(el.text, el.x, el.y);
          break;
        case 'image':
          {
            const source = el.imageUrl || el.filePath;
            if (!source) break;
            const imagePath = el.filePath ? path.resolve(el.filePath) : el.imageUrl;
            const image = await loadImage(imagePath);
            const w = el.width || image.width;
            const h = el.height || image.height;
            ctx.drawImage(image, el.x, el.y, w, h);
          }
          break;
        default:
          break;
      }
    } catch (err) {
      console.error('Error drawing element', el, err && err.message);
    }
  }
}

exports.exportPDFAPI = async (req, res) => {
  try {
    if (!state.canvas || !state.ctx) return res.status(400).json({ error: 'Canvas not initialized' });
    await redrawAll();
    const imgBuffer = state.canvas.toBuffer('image/png');
    const doc = new PDFDocument({ autoFirstPage: false });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=canvas.pdf');
    doc.pipe(res);
    doc.addPage({ size: [state.width, state.height] });
    doc.image(imgBuffer, 0, 0, { width: state.width, height: state.height });
    doc.end();
  } catch (err) {
    console.error('exportPDFAPI error', err);
    return res.status(500).json({ error: 'Failed to export PDF' });
  }
};

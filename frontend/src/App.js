import React, { useState } from 'react';
import CanvasForm from './components/CanvasForm';
import ElementForm from './components/ElementForm';
import axios from 'axios';
import './App.css'; // Ensure CSS is imported

function App() {
  const [canvasSize, setCanvasSize] = useState({ width: 600, height: 400 });

  const handleExport = async () => {
    const response = await axios.get('http://localhost:5000/api/canvas/export', {
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'canvas.pdf');
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className="app-container">
      <h1>Canvas Builder</h1>
      <div style={{ marginBottom: '32px' }}>
        <CanvasForm setCanvasSize={setCanvasSize} />
      </div>
      <div style={{ marginBottom: '32px', borderTop: '1px solid #eee', paddingTop: '32px' }}>
        <ElementForm />
      </div>
      <div style={{ textAlign: 'center' }}>
        <button onClick={handleExport}>Export PDF</button>
      </div>
    </div>
  );
}

export default App;

import React, { useState } from 'react';
import CanvasForm from './components/CanvasForm';
import ElementForm from './components/ElementForm';
import axios from 'axios';
import './App.css'; 

function App() {
  const [canvasSize, setCanvasSize] = useState({ width: 600, height: 400 });

  const handleExport = async () => {
    const response = await axios.get('https://localhost:5000/api/canvas/export', {
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
      <CanvasForm setCanvasSize={setCanvasSize} />
      <ElementForm />
      <div style={{ textAlign: 'center' }}>
        <button onClick={handleExport}>Export PDF</button>
      </div>
    </div>
  );
}

export default App;

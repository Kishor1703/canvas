import React, { useState } from 'react';
import axios from 'axios';

const CanvasForm = ({ setCanvasSize }) => {
  const [width, setWidth] = useState(600);
  const [height, setHeight] = useState(400);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:5000/api/canvas/create', { width, height });
    setCanvasSize({ width, height });
    alert('Canvas Initialized');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Initialize Canvas</h3>
      <label>Width: </label>
      <input type="number" value={width} onChange={(e) => setWidth(e.target.value)} />
      <label>Height: </label>
      <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} />
      <button type="submit">Create Canvas</button>
    </form>
  );
};

export default CanvasForm;

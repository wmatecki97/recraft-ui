import React, { useState } from 'react';
import './App.css';
import ImageGallery from './components/ImageGallery';
import ImageGeneratorForm from './components/ImageGeneratorForm';

function App() {
  const [generatedImages, setGeneratedImages] = useState([]);

  const handleImageGeneration = (images) => {
    setGeneratedImages(images);
  };

  return (
    <div className="App">
      <h1>Recraft Image Generator</h1>
      <ImageGeneratorForm onGenerate={handleImageGeneration} />
      <ImageGallery images={generatedImages} />
    </div>
  );
}

export default App;

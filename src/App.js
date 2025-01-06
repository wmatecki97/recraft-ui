import React, { useState } from 'react';
import './App.css';
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
      {generatedImages.length > 0 && <p>Images generated!</p>}
    </div>
  );
}

export default App;

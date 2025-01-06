import React, { useState } from 'react';
import './App.css';
import ImageGeneratorForm from './components/ImageGeneratorForm';

function App() {
  const [generatedImages, setGeneratedImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleImageGeneration = (images) => {
    setGeneratedImages(images);
    setLoading(false);
  };

  const handleGenerationStart = () => {
    setLoading(true);
    setGeneratedImages([]);
  }

  return (
    <div className="App">
      <h1>Recraft Image Generator</h1>
      <ImageGeneratorForm onGenerate={handleImageGeneration} onGenerationStart={handleGenerationStart} />
      {generatedImages.length > 0 && !loading && <p>Images generated!</p>}
    </div>
  );
}

export default App;

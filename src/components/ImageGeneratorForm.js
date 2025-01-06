import React, { useState } from 'react';

const ImageGeneratorForm = ({ onGenerate }) => {
    const [apiKey, setApiKey] = useState('');
    const [prompt, setPrompt] = useState('Turtle working in AI');
    const colorsData = [{"rgb":[142,202,230]},{"rgb":[88,180,209]},{"rgb":[33,158,188]},{"rgb":[18,103,130]},{"rgb":[2,48,71]},{"rgb":[255,183,3]},{"rgb":[253,158,2]},{"rgb":[251,133,0]}];
    const [colors, setColors] = useState(JSON.stringify(colorsData));
    const [responseFormat, setResponseFormat] = useState('url');
    const [artisticLevel, setArtisticLevel] = useState(5);
    const [size, setSize] = useState('1024x1024');
    const [numImagesPerPrompt, setNumImagesPerPrompt] = useState(1);
    const [loading, setLoading] = useState(false);

    const downloadImage = (url, filename) => {
        fetch(url, {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Access-Control-Allow-Origin': '*',
            }
        })
            .then(response => response.blob())
            .then(blob => {
                const blobURL = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = blobURL;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(blobURL);
            })
            .catch(error => console.error('Error downloading image:', error));
    };


    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        try {
            const response = await fetch('https://external.api.recraft.ai/v1/images/generations', {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                    prompt: prompt,
                    model: "recraftv3",
                    n: numImagesPerPrompt,
                    style: "vector_illustration",
                    substyle:"roundish_flat",
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message || 'Unknown error'}`);
            }


            const responseData = await response.json();
            if (responseData && responseData.data) {
                const image_urls = responseData.data
                    .filter(item => item.url)
                    .map((item, index) => ({url: item.url, filename: `image_${index + 1}.png`}));
                if (image_urls.length > 0) {
                    image_urls.forEach(image => downloadImage(image.url, image.filename));
                    onGenerate(image_urls.map(image => image.url));
                } else {
                    onGenerate(["No image URLs found in response"]);
                }
            } else {
                 onGenerate(["No images generated"]);
            }
        } catch (error) {
            console.error("Request Error:", error);
            onGenerate([`Request Error: ${error.message}`]);
        } finally {
            setLoading(false);
        }
    };


    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Recraft API Key:</label>
                <input type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
            </div>
            <div>
                <label>Prompt:</label>
                <input type="text" value={prompt} onChange={(e) => setPrompt(e.target.value)} />
            </div>
            <div>
                <label>Colors (JSON string):</label>
                <input type="text" value={colors} onChange={(e) => setColors(e.target.value)} />
            </div>
            <div>
                <label>Response Format:</label>
                <select value={responseFormat} onChange={(e) => setResponseFormat(e.target.value)}>
                    <option value="url">url</option>
                    <option value="b64_json">b64_json</option>
                </select>
            </div>
             <div>
                <label>Artistic Level:</label>
                <input type="number" value={artisticLevel} min="0" max="10" step="1" onChange={(e) => setArtisticLevel(parseInt(e.target.value, 10))} />
            </div>
            <div>
                <label>Size:</label>
                <select value={size} onChange={(e) => setSize(e.target.value)}>
                    <option value="256x256">256x256</option>
                    <option value="512x512">512x512</option>
                    <option value="1024x1024">1024x1024</option>
                    <option value="1024x1792">1024x1792</option>
                    <option value="1792x1024">1792x1024</option>
                </select>
            </div>
            <div>
                <label>Number of Images:</label>
                <input type="number" value={numImagesPerPrompt} min="1" max="4" onChange={(e) => setNumImagesPerPrompt(parseInt(e.target.value, 10))} />
            </div>
            <button type="submit" disabled={loading}>
                {loading ? 'Generating...' : 'Generate Image'}
            </button>
        </form>
    );
};

export default ImageGeneratorForm;

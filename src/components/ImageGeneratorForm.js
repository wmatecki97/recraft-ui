import React, { useState, useEffect } from 'react';
import ColorPicker from './ColorPicker';

const ImageGeneratorForm = ({ onGenerate }) => {
    const [apiKey, setApiKey] = useState('');
    const [prompt, setPrompt] = useState('');
    const initialColorsData = [{ "rgb": [142, 202, 230] }, { "rgb": [88, 180, 209] }, { "rgb": [33, 158, 188] }, { "rgb": [18, 103, 130] }, { "rgb": [2, 48, 71] }, { "rgb": [255, 183, 3] }, { "rgb": [253, 158, 2] }, { "rgb": [251, 133, 0] }];
    const [colors, setColors] = useState([]);
    const [responseFormat, setResponseFormat] = useState(null);
    const [artisticLevel, setArtisticLevel] = useState(null);
    const [size, setSize] = useState(null);
    const [numImagesPerPrompt, setNumImagesPerPrompt] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showAdvancedSettings, setShowAdvancedSettings] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const storedSettings = localStorage.getItem('imageGeneratorSettings');
        let settings;
        if (storedSettings) {
            settings = JSON.parse(storedSettings);
        }

        setApiKey(settings?.apiKey || '');
        setPrompt(settings?.prompt || 'Robot jumping rope');
        setColors(settings?.colors || initialColorsData.map(color => rgbToHex(color.rgb)));
        setResponseFormat(settings?.responseFormat || 'url');
        setArtisticLevel(settings?.artisticLevel || 5);
        setSize(settings?.size || '1024x1024');
        setNumImagesPerPrompt(settings?.numImagesPerPrompt || 1);
        setShowAdvancedSettings(settings?.showAdvancedSettings || false);
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (isLoaded) {
            const settings = {
                apiKey,
                prompt,
                colors,
                responseFormat,
                artisticLevel,
                size,
                numImagesPerPrompt,
                showAdvancedSettings
            };
            localStorage.setItem('imageGeneratorSettings', JSON.stringify(settings));
        }
    }, [apiKey, prompt, colors, responseFormat, artisticLevel, size, numImagesPerPrompt, showAdvancedSettings, isLoaded]);


    function rgbToHex(rgb) {
        const [r, g, b] = rgb;
        return `#${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)}`;
    }

    const handleColorsChange = (newColors) => {
        setColors(newColors);
    };

    const downloadImage = async (url, filename) => {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
            }
            const blob = await response.blob();
            const blobURL = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = blobURL;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(blobURL);
        } catch (error) {
            console.error('Error downloading image:', error);
        }
    };

    const handleImportSettings = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const settings = JSON.parse(e.target.result);
                    setApiKey(settings.apiKey || '');
                    setPrompt(settings.prompt || 'Robot jumping rope');
                    setColors(settings.colors || initialColorsData.map(color => rgbToHex(color.rgb)));
                    setResponseFormat(settings.responseFormat || 'url');
                    setArtisticLevel(settings.artisticLevel || 5);
                    setSize(settings.size || '1024x1024');
                    setNumImagesPerPrompt(settings.numImagesPerPrompt || 1);
                    setShowAdvancedSettings(settings.showAdvancedSettings || false);
                } catch (error) {
                    console.error("Error parsing settings file:", error);
                    alert("Failed to import settings. Please ensure the file is a valid JSON.");
                }
            };
            reader.readAsText(file);
        }
    };

    const handleExportSettings = () => {
        const settings = {
            apiKey,
            prompt,
            colors,
            responseFormat,
            artisticLevel,
            size,
            numImagesPerPrompt,
            showAdvancedSettings
        };
        const json = JSON.stringify(settings, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'image_generator_settings.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
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
                    substyle: "roundish_flat",
                    // "response_format": responseFormat,
                    // "artistic_level": artisticLevel,
                    // "size": size,
                    "controls": {
                        "colors": colors.map(hex => {
                            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                            return result ? {
                                "rgb": [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
                            } : null;
                        }).filter(color => color)
                    }
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
                    .map((item, index) => ({ url: item.url, filename: `image_${index + 1}.png` }));
                if (image_urls.length > 0) {
                    await Promise.all(image_urls.map(image => downloadImage(image.url, image.filename)));
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
                <label>Colors:</label>
                <ColorPicker initialColors={colors} onColorsChange={handleColorsChange} />
            </div>

            <button type="button" onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}>
                Advanced Settings {showAdvancedSettings ? '▲' : '▼'}
            </button>

            {showAdvancedSettings && (
                <>
                    {/* <div>
                        <label>Response Format:</label>
                        <select value={responseFormat} onChange={(e) => setResponseFormat(e.target.value)}>
                            <option value="url">url</option>
                            <option value="b64_json">b64_json</option>
                        </select>
                    </div> */}
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
                </>
            )}
            <div>
                <button type="button" onClick={handleExportSettings}>Export Settings</button>
                <input type="file" accept=".json" onChange={handleImportSettings} style={{ display: 'none' }} id="import-settings" />
                <label htmlFor="import-settings">Import Settings</label>
            </div>
            <button type="submit" disabled={loading}>
                {loading ? 'Generating...' : 'Generate Image'}
            </button>
        </form>
    );
};

export default ImageGeneratorForm;

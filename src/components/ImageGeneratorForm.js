import React, { useState, useEffect } from 'react';
import ColorPicker from './ColorPicker';
import ApiKeyInput from './ApiKeyInput';
import PromptInput from './PromptInput';
import AdvancedSettings from './AdvancedSettings';
import SettingsImportExport from './SettingsImportExport';
import GenerateButton from './GenerateButton';
import { rgbToHex, downloadImage, handleImportSettings, handleExportSettings } from '../utils/imageGeneratorUtils';

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
    const [generatedImages, setGeneratedImages] = useState([]);


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


    const handleColorsChange = (newColors) => {
        setColors(newColors);
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
                    setGeneratedImages(image_urls.map(image => image.url));
                } else {
                    onGenerate(["No image URLs found in response"]);
                    setGeneratedImages(["No image URLs found in response"]);
                }
            } else {
                onGenerate(["No images generated"]);
                setGeneratedImages(["No images generated"]);
            }
        } catch (error) {
            console.error("Request Error:", error);
            onGenerate([`Request Error: ${error.message}`]);
            setGeneratedImages([`Request Error: ${error.message}`]);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div>
            <form onSubmit={handleSubmit}>
                <ApiKeyInput apiKey={apiKey} setApiKey={setApiKey} />
                <PromptInput prompt={prompt} setPrompt={setPrompt} />
                <div>
                    <label>Colors:</label>
                    <ColorPicker initialColors={colors} onColorsChange={handleColorsChange} />
                </div>

                <AdvancedSettings
                    artisticLevel={artisticLevel}
                    setArtisticLevel={setArtisticLevel}
                    size={size}
                    setSize={setSize}
                    numImagesPerPrompt={numImagesPerPrompt}
                    setNumImagesPerPrompt={setNumImagesPerPrompt}
                    showAdvancedSettings={showAdvancedSettings}
                    setShowAdvancedSettings={setShowAdvancedSettings}
                />
                <SettingsImportExport
                    handleExportSettings={() => handleExportSettings(apiKey, prompt, colors, responseFormat, artisticLevel, size, numImagesPerPrompt, showAdvancedSettings)}
                    handleImportSettings={(event) => handleImportSettings(event, setApiKey, setPrompt, setColors, initialColorsData, setResponseFormat, setArtisticLevel, setSize, setNumImagesPerPrompt, setShowAdvancedSettings)}
                />
                <GenerateButton loading={loading} handleSubmit={handleSubmit} />
            </form>
            <div className="generated-images">
                {generatedImages.map((imageUrl, index) => (
                    <div key={index}>
                        {imageUrl.startsWith("Request Error") || imageUrl === "No images generated" || imageUrl === "No image URLs found in response" ? (
                            <p>{imageUrl}</p>
                        ) : (
                            <img src={imageUrl} alt={`Generated Image ${index + 1}`} style={{ maxWidth: '300px', margin: '10px' }} />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ImageGeneratorForm;

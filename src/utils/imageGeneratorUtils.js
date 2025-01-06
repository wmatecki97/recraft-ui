export function rgbToHex(rgb) {
    const [r, g, b] = rgb;
    return `#${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)}`;
}

export const downloadImage = async (url, filename) => {
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


export const handleImportSettings = (event, setApiKey, setPrompt, setColors, initialColorsData, setResponseFormat, setArtisticLevel, setSize, setNumImagesPerPrompt, setShowAdvancedSettings) => {
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


export const handleExportSettings = (apiKey, prompt, colors, responseFormat, artisticLevel, size, numImagesPerPrompt, showAdvancedSettings) => {
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

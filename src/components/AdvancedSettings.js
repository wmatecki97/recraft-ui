import React from 'react';

const AdvancedSettings = ({ artisticLevel, setArtisticLevel, size, setSize, numImagesPerPrompt, setNumImagesPerPrompt, showAdvancedSettings, setShowAdvancedSettings }) => {
    return (
        <div>
            <button type="button" onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}>
                Advanced Settings {showAdvancedSettings ? '▲' : '▼'}
            </button>

            {showAdvancedSettings && (
                <>
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
        </div>
    );
};

export default AdvancedSettings;

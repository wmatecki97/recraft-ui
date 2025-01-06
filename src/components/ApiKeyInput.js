import React from 'react';

const ApiKeyInput = ({ apiKey, setApiKey }) => {
    return (
        <div>
            <label>Recraft API Key:</label>
            <input type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
        </div>
    );
};

export default ApiKeyInput;

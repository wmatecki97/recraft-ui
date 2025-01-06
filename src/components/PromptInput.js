import React from 'react';

const PromptInput = ({ prompt, setPrompt }) => {
    return (
        <div>
            <label>Prompt:</label>
            <input type="text" value={prompt} onChange={(e) => setPrompt(e.target.value)} />
        </div>
    );
};

export default PromptInput;

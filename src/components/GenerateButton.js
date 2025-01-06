import React from 'react';

const GenerateButton = ({ loading, handleSubmit }) => {
    return (
        <button type="submit" disabled={loading}>
            {loading ? 'Generating...' : 'Generate Image'}
        </button>
    );
};

export default GenerateButton;

import React, { useState, useEffect } from 'react';
import './ColorPicker.css';

const ColorPicker = ({ initialColors, onColorsChange }) => {
    const [colors, setColors] = useState([]);

    useEffect(() => {
        if (initialColors) {
            setColors(initialColors);
        }
    }, [initialColors]);


    const handleColorChange = (index, newColor) => {
        const updatedColors = [...colors];
        updatedColors[index] = newColor;
        setColors(updatedColors);
        onColorsChange(updatedColors);
    };

    const addColor = () => {
        const updatedColors = [...colors, '#ffffff'];
        setColors(updatedColors);
        onColorsChange(updatedColors);
    };

    const removeColor = (index) => {
        const updatedColors = colors.filter((_, i) => i !== index);
        setColors(updatedColors);
        onColorsChange(updatedColors);
    };

    return (
        <div className="color-picker">
            {colors.map((color, index) => (
                <div key={index} className="color-input-container">
                    <input
                        type="color"
                        value={color}
                        onChange={(e) => handleColorChange(index, e.target.value)}
                    />
                    <button type="button" onClick={() => removeColor(index)} className="remove-color-button">
                        -
                    </button>
                </div>
            ))}
            <button type="button" onClick={addColor} className="add-color-button">
                Add Color
            </button>
        </div>
    );
};

export default ColorPicker;

import React from 'react';

const ImageGallery = ({ images }) => {
    return (
        <div>
            {images && images.length > 0 ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {images.map((image, index) => (
                        <div key={index} style={{maxWidth: '300px'}}>
                            {image.startsWith('http') ? (
                                <img src={image} alt={`Generated Image ${index}`} style={{ maxWidth: '100%', height: 'auto' }} />
                            ) : (
                                <p>{image}</p>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <p>No images generated yet.</p>
            )}
        </div>
    );
};

export default ImageGallery;

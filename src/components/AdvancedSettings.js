import React from 'react';

const AdvancedSettings = ({ artisticLevel, setArtisticLevel, size, setSize, numImagesPerPrompt, setNumImagesPerPrompt, showAdvancedSettings, setShowAdvancedSettings, style, setStyle, substyle, setSubstyle, styleId, setStyleId }) => {

    const styles = [
        "any",
        "realistic_image",
        "digital_illustration",
        "vector_illustration",
        "icon"
    ];

    const substyles = {
        "any": [],
        "realistic_image": [
            "b_and_w",
            "enterprise",
            "evening_light",
            "faded_nostalgia",
            "forest_life",
            "hard_flash",
            "hdr",
            "motion_blur",
            "mystic_naturalism",
            "natural_light",
            "natural_tones",
            "organic_calm",
            "real_life_glow",
            "retro_realism",
            "retro_snapshot",
            "studio_portrait",
            "urban_drama",
            "village_realism",
            "warm_folk"
        ],
        "digital_illustration": [
            "2d_art_poster",
            "2d_art_poster_2",
            "engraving_color",
            "grain",
            "hand_drawn",
            "hand_drawn_outline",
            "handmade_3d",
            "infantile_sketch",
            "pixel_art",
            "antiquarian",
            "bold_fantasy",
            "child_book",
            "child_books",
            "cover",
            "crosshatch",
            "digital_engraving",
            "expressionism",
            "freehand_details",
            "grain_20",
            "graphic_intensity",
            "hard_comics",
            "long_shadow",
            "modern_folk",
            "multicolor",
            "neon_calm",
            "noir",
            "nostalgic_pastel",
            "outline_details",
            "pastel_gradient",
            "pastel_sketch",
            "pop_art",
            "pop_renaissance",
            "street_art",
            "tablet_sketch",
            "urban_glow",
            "urban_sketching",
            "vanilla_dreams",
            "young_adult_book",
            "young_adult_book_2"
        ],
        "vector_illustration": [
            "bold_stroke",
            "chemistry",
            "colored_stencil",
            "contour_pop_art",
            "cosmics",
            "cutout",
            "depressive",
            "editorial",
            "emotional_flat",
            "engraving",
            "infographical",
            "line_art",
            "line_circuit",
            "linocut",
            "marker_outline",
            "mosaic",
            "naivector",
            "roundish_flat",
            "segmented_colors",
            "sharp_contrast",
            "thin",
            "vector_photo",
            "vivid_shapes"
        ],
        "icon": []
    };


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
                     <div>
                        <label>Style ID:</label>
                        <input type="text" value={styleId} onChange={(e) => setStyleId(e.target.value)} />
                    </div>
                    {!styleId && (
                        <>
                            <div>
                                <label>Style:</label>
                                <select value={style} onChange={(e) => setStyle(e.target.value)}>
                                    {styles.map(style => (
                                        <option key={style} value={style}>{style}</option>
                                    ))}
                                </select>
                            </div>
                            {style && style !== "any" && (
                                <div>
                                    <label>Substyle:</label>
                                    <select value={substyle} onChange={(e) => setSubstyle(e.target.value)}>
                                        {substyles[style].map(substyle => (
                                            <option key={substyle} value={substyle}>{substyle}</option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default AdvancedSettings;

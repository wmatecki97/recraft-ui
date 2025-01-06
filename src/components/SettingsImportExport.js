import React from 'react';

const SettingsImportExport = ({ handleExportSettings, handleImportSettings }) => {
    return (
        <div>
            <button type="button" onClick={handleExportSettings}>Export Settings</button>
            <input type="file" accept=".json" onChange={handleImportSettings} style={{ display: 'none' }} id="import-settings" />
            <label htmlFor="import-settings">Import Settings</label>
        </div>
    );
};

export default SettingsImportExport;

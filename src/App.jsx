import { useState } from 'react';
import UploadButton from "./comps/UploadButton";
import Tinder from "./comps/Tinder.jsx"; // Import the merged Tinder component
import './App.css';

function App() {
  const [folderMap, setFolderMap] = useState(new Map());

  const handleFileUpdate = (newFolderNames, newFolderMap, newPngFiles, newJsonFiles) => {
    console.log('App.jsx: handleFileUpdate');
    console.log('PNG Files:', newPngFiles);
    console.log('JSON Files:', newJsonFiles);
    console.log('Folder Names:', newFolderNames);
    console.log('Folder Map:', newFolderMap);

    setFolderMap(newFolderMap);

    // logs in a console if the folderMap is empty
    if (newFolderMap.size === 0) {
      console.log('Folder Map is empty');
    } else {
      console.log('Folder Map is not empty');
    }
  };

  return (
    <div className="big-wrapper">
      <div>
        <a href="https://github.com/CICLAB-Comillas" target="_blank" rel="noreferrer">
          <img src='/logo-ciclab.png' className="logo ciclab" alt="CICLAB logo" />
        </a>
      </div>
      <h1>Herramienta Secretaría</h1>
      <h2>Filtro de notas</h2>
      <h5>
        by:
        <br /> A. Gómez, M. Hervás
        <br /> M. Liz, A. Quintana
      </h5>

      <div className="card">
        <UploadButton onFileUpload={handleFileUpdate} folderMap={folderMap} />
        <br />
        {folderMap.size > 0 && (
          <div className="fileDisplay"><p>Upload Successful</p></div>
        )}
      </div>

      {folderMap.size > 0 && (
        <div className="card">
          <Tinder map={folderMap} />
        </div>
      )}
      <p className="read-the-docs">
        To learn more click on the CICLAB logo or visit{' '}
        <a href="https://github.com/CICLAB-Comillas" target="_blank" rel="noreferrer">
          https://github.com/CICLAB-Comillas
        </a>
      </p>
    </div>
  );
}

export default App;

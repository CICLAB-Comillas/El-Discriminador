import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Tinder from './Tinder';

const TinderParent = ({ map }) => {
  const [currentKeyIndex, setCurrentKeyIndex] = useState(0);
  const outerFolder = Array.from(map.keys())[0] || ''; // Use an empty string as a fallback
  const keys = Array.from(map.get(outerFolder)?.keys()) || [];

  useEffect(() => {
    // Ensure the currentKeyIndex stays within bounds when the map changes
    setCurrentKeyIndex((prevIndex) => Math.min(prevIndex, keys.length - 1));
  }, [map, keys]);

  const handleNextKey = () => {
    setCurrentKeyIndex((prevIndex) => (prevIndex + 1) % keys.length);
  };

  const handlePrevKey = () => {
    setCurrentKeyIndex((prevIndex) => (prevIndex - 1 + keys.length) % keys.length);
  };

  const getCurrentKey = () => {
    return keys[currentKeyIndex] || '';
  };

  const getFilesForCurrentKey = () => {
    const currentKey = getCurrentKey();
    const pngFiles = [];
    const jsonFiles = [];

    const subfolderMap = map.get(outerFolder)?.get(currentKey) || [];

    subfolderMap.forEach(file => {
      if (file.type === 'image/png') {
        pngFiles.push(file);
      } else if (file.type === 'application/json') {
        jsonFiles.push(file);
      }
    });

    return [pngFiles, jsonFiles];
  };

  const [pngFiles, jsonFiles] = getFilesForCurrentKey();

  // No need to create an array for folderData, directly use an object
  const folderData = {
    folderName: getCurrentKey(),
    pngFiles: pngFiles,
    jsonFiles: jsonFiles,
  };

  // Add a useEffect to log folderData when it changes
  useEffect(() => {
    console.log('folderData:', folderData);
  }, [folderData]);

  return (
    <div>
      <button onClick={handlePrevKey}>&lt;</button>
      <button onClick={handleNextKey}>&gt;</button>
      <h2>{getCurrentKey()}</h2>
      <Tinder
        pngFiles={pngFiles}
        jsonFiles={jsonFiles}
      />
    </div>
  );
};

TinderParent.propTypes = {
  map: PropTypes.object.isRequired,
};

export default TinderParent;

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import PropTypes from 'prop-types';

const UploadButton = ({ tagText = 'UPLOAD A FOLDER', onFileUpload}) => {
  const [progress, setProgress] = useState(0);

  const uploadFile = useCallback(
      (file) => {
        return new Promise((resolve) => {
          setTimeout(resolve, 100); // Simulate upload delay
        });
      },
      []
  );


  const extractFolderNames = (files) => {
    const folderMap = new Map();

    for (const file of files) {
      const path = file.webkitRelativePath || file.mozRelativePath || file.relativePath || file.name;
      const [mainFolder, subfolder] = path.split('/');

      if (!folderMap.has(mainFolder)) {
        folderMap.set(mainFolder, new Map());
      }

      if (subfolder) {
        const subfolderMap = folderMap.get(mainFolder);
        if (!subfolderMap.has(subfolder)) {
          subfolderMap.set(subfolder, []);
        }
        subfolderMap.get(subfolder).push(file);
      }
    }

    console.log('Folder Map:', folderMap); // Log the final folderMap
    return folderMap;
  };




  const handleDrop = useCallback(async (acceptedFiles) => {
    console.log('Handling dropped files');

    const folderMap = new Map(); // Map to store files grouped by folder
    const allFolderNames = extractFolderNames(acceptedFiles); // Extract all folder names

    // Group the dropped files by their parent folder
    acceptedFiles.forEach((file) => {
      const parentFolder = file.webkitRelativePath.split('/')[0]; // Get the parent folder name
      if (!folderMap.has(parentFolder)) {
        folderMap.set(parentFolder, {
          pngFiles: [],
          jsonFiles: [],
          folderName: parentFolder,
        });
      }

      const folder = folderMap.get(parentFolder);
      if (file.type === 'image/png') {
        folder.pngFiles.push(file);
      } else if (file.type === 'application/json') {
        folder.jsonFiles.push(file);
      }
    });

    let totalFiles = 0;
    let loadedFiles = 0;

    // Count total number of files
    for (const { pngFiles, jsonFiles } of folderMap.values()) {
      totalFiles += pngFiles.length + jsonFiles.length;
    }

    // Simulate the upload progress with a delay
    for (const { pngFiles, jsonFiles } of folderMap.values()) {
      for (const file of pngFiles.concat(jsonFiles)) {
        await uploadFile(file);
        loadedFiles++;
        const progress = Math.min(Math.floor((loadedFiles / totalFiles) * 100), 100);
        setProgress(progress);
      }
    }

    console.log('Finished uploading files');

    console.log('New folderMap', folderMap);
    console.log('allFolderNames', allFolderNames);

    // Convert folderMap back to an array of objects
    const folderNames = Array.from(folderMap.values());

    console.log('ARRAY', folderNames);

    onFileUpload(folderNames, allFolderNames);
    setProgress(0); // Reset progress after uploading files
  }, [onFileUpload, uploadFile]);






  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    noClick: true,
    noKeyboard: true,
    multiple: true,
    accept: ['.png', '.json'],
  });

  return (
      <div className="dropzone-wrapper">
        <div {...getRootProps()} className={`tag ${isDragActive ? 'dropzone-active' : 'dropzone-inactive'}`}>
          <input {...getInputProps()} />
          <div className="tag-text">{tagText}</div>
          <div className={`dropzone-text ${isDragActive ? 'dropzone-active' : 'dropzone-inactive'}`}>
            {isDragActive ? 'Drop the files here' : 'Drag and drop to upload files'}
          </div>
        </div>
        {progress > 0 && (
            <div className="progress-bar-wrapper">
              <progress value={progress} max={100} style={{ width: '100%' }} />
              <p>{`File upload progress: ${progress}%`}</p>
            </div>
        )}
      </div>
  );
};

UploadButton.propTypes = {
  tagText: PropTypes.string,
  onFileUpload: PropTypes.func.isRequired,
  folderMap: PropTypes.instanceOf(Map).isRequired, // Add this line;
}


export default UploadButton;


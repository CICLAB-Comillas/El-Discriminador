import React, { useRef, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDropzone } from 'react-dropzone';

const UploadButton = ({ tagText = 'UPLOAD A FOLDER', onFileUpload }) => {
  const fileInputRef = useRef(null);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [fileURLs, setFileURLs] = useState([]);
  const [progress, setProgress] = useState(0);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = useCallback((event) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const folder = files[0];
      setSelectedFolder(folder);

      const fileURLs = [];
      const readerPromises = [];

      const entries = folder.webkitEntries || folder.entries || [];

      const readEntries = (entries) => {
        const reader = new FileReader();
        const readerPromise = new Promise((resolve) => {
          reader.onload = () => {
            const fileContent = reader.result;
            resolve(fileContent);
          };
        });

        entries.forEach((entry) => {
          if (entry.isFile) {
            const file = entry.file((file) => {
              const fileURL = URL.createObjectURL(file);
              fileURLs.push(fileURL);
              reader.readAsText(file);
            });
          } else if (entry.isDirectory) {
            const reader = entry.createReader();
            reader.readEntries(readEntries);
          }
        });

        readerPromises.push(readerPromise);
      };

      readEntries(entries);

      Promise.all(readerPromises).then(() => {
        onFileUpload(fileURLs);
      });

      setFileURLs(fileURLs);
    }
  }, [onFileUpload]);

  const uploadFile = useCallback(
    (file) => {
      return new Promise((resolve) => {
        setTimeout(resolve, 100); // Simulate upload delay
      });
    },
    []
  );

  const handleDrop = useCallback(async (acceptedFiles) => {
    const pngFiles = [];
    const jsonFiles = [];

    // Separate the dropped files into PNG and JSON files based on their extensions
    acceptedFiles.forEach((file) => {
      if (file.type === 'image/png') {
        pngFiles.push(file);
      } else if (file.type === 'application/json') {
        jsonFiles.push(file);
      }
    });

    const totalFiles = pngFiles.length + jsonFiles.length;
    let loadedFiles = 0;

    // Simulate the upload progress with a delay
    for (const file of acceptedFiles) {
      await uploadFile(file);
      loadedFiles++;
      const progress = Math.min(Math.floor((loadedFiles / totalFiles) * 100), 100);
      setProgress(progress);
    }

    onFileUpload(pngFiles, jsonFiles);
    setProgress(0); // Reset progress after uploading files
  }, [onFileUpload, uploadFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    multiple: true,
    directory: true,
    accept: ['.png', '.json'],
  });

  return (
    <div className="dropzone-wrapper">
      <div
        {...getRootProps()}
        className={`tag ${isDragActive ? 'dropzone-active' : 'dropzone-inactive'}`}
      >
        <input
          {...getInputProps()}
          ref={fileInputRef}
          type="file"
          style={{ display: 'none' }}
          onChange={handleFileChange}
          webkitdirectory="true"
          directory="true"
        />
        <div className="tag-text">{tagText}</div>
        <div className={`dropzone-text ${isDragActive ? 'dropzone-active' : 'dropzone-inactive'}`}>
          {isDragActive ? 'Drop the files here' : 'Drag and drop or click to upload files'}
        </div>
      </div>
      {selectedFolder && (
        <div>
          <h4>Selected Folder:</h4>
          <div className="folderDisplay">
            <span className="folderIcon">&#128193;</span>
            <p className="folderName">{selectedFolder.name}</p>
          </div>
        </div>
      )}
      {progress > 0 && (
        <div className="progress-bar-wrapper">
          <progress value={progress} max={100} style={{ width: '100%' }} />
          <p>{`File upload progress: ${progress}%`}</p>
        </div>
      )}
      {fileURLs.length > 0 && (
        <div className="fileDisplay">
          <p>{`File Uploaded: ${fileURLs[fileURLs.length - 1]}`}</p>
        </div>
      )}
    </div>
  );
};

UploadButton.propTypes = {
  tagText: PropTypes.string,
  onFileUpload: PropTypes.func.isRequired,
};

export default UploadButton;

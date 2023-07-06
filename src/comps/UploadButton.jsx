import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { useDropzone } from 'react-dropzone';

const UploadButton = ({ tagText = "UPLOAD A FOLDER", onFileUpload }) => {
  const [progress, setProgress] = useState(0);

  const onDrop = useCallback(async (acceptedFiles) => {
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
  }, [onFileUpload]);

  const uploadFile = (file) => {
    return new Promise((resolve) => {
      setTimeout(resolve, 1000); // Simulate upload delay
    });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    directory: true,
  });

  return (
    <div className="dropzone-wrapper">
      <div {...getRootProps()} className="tag">
        <input {...getInputProps()} accept=".png,.json" />
        <div className="tag-text">{tagText}</div>
        {isDragActive ? (
          <div className="dropzone-active">Drop the files here</div>
        ) : (
          <div className="dropzone-inactive">Drag and drop or click to upload files</div>
        )}

        <br />

        {progress > 0 && <progress value={progress} max={100} style={{ width: '100%' }} />}
        {progress > 0 && <p>{`File upload progress: ${progress}%`}</p>}
      </div>
    </div>
  );
};

UploadButton.propTypes = {
  tagText: PropTypes.string,
  onFileUpload: PropTypes.func.isRequired,
};

export default UploadButton;

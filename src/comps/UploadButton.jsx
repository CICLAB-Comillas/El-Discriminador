import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDropzone } from 'react-dropzone';

const UploadButton = ({ tagText = "UPLOAD A FOLDER", onFileUpload }) => {
  const onDrop = useCallback(async (acceptedFiles) => {
    const pngFiles = [];
    const jsonFiles = [];

    for (let i = 0; i < acceptedFiles.length; i++) {
      const file = acceptedFiles[i];
      const extension = file.name.split('.').pop();

      if (extension === 'png' && file.type === 'image/png') {
        pngFiles.push(file);
      } else if (extension === 'json' && file.type === 'application/json') {
        jsonFiles.push(file);
      }
    }

    const fileNames = acceptedFiles.map((file) => file.name);
    console.log(fileNames);

    onFileUpload(pngFiles, jsonFiles);
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    directory: true,
    accept: ['.png', '.json'],
  });

  return (
    <div className="dropzone-wrapper">
      <div {...getRootProps()} className="tag">
        <input {...getInputProps()} />
        <div className="tag-text">{tagText}</div>
        <div className={`dropzone-text ${isDragActive ? 'dropzone-active' : 'dropzone-inactive'}`}>
          {isDragActive ? 'Drop the files here' : 'Drag and drop or click to upload files'}
        </div>
      </div>
    </div>
  );
};

UploadButton.propTypes = {
  tagText: PropTypes.string,
  onFileUpload: PropTypes.func.isRequired,
};

export default UploadButton;

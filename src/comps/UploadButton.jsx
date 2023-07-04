import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDropzone } from 'react-dropzone';

const UploadButton = ({ tagText = "UPLOAD A FOLDER", onFileUpload }) => {
    const onDrop = useCallback((acceptedFiles) => {
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

        onFileUpload(pngFiles, jsonFiles);
    }, [onFileUpload]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        multiple: true,
        directory: true,
    });

    return (
        <div className={"dropzone-wrapper"}>
        <div {...getRootProps()} className="tag">
            <input {...getInputProps()} accept=".png,.json" />
            <div className="tag-text">{tagText}</div>
            {isDragActive ? (
                <div className="dropzone-active">Drop the files here</div>
            ) : (
                <div className="dropzone-inactive">Drag and drop or click to upload files</div>
            )}
        </div>
        </div>
    );
};

UploadButton.propTypes = {
    tagText: PropTypes.string,
    onFileUpload: PropTypes.func.isRequired,
};

export default UploadButton;

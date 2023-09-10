import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Tinder from "./Tinder";

const TinderParent = ({ map }) => {
    const [currentKeyIndex, setCurrentKeyIndex] = useState(0);
    const outerFolder = Array.from(map.keys())[0]; // Assuming there's always at least one key, "gui_data" in your case
    const keys = Array.from(map.get(outerFolder).keys()); // Fetch the subfolder keys (001, 002, 003)

    const handleNextKey = () => {
        setCurrentKeyIndex((prevIndex) => (prevIndex + 1) % keys.length);
        getFilesForCurrentKey();
    };

    const handlePrevKey = () => {
        setCurrentKeyIndex((prevIndex) => (prevIndex - 1 + keys.length) % keys.length);
        getFilesForCurrentKey();
    };

    const getCurrentKey = () => {
        return keys[currentKeyIndex];
    };

    const getFilesForCurrentKey = () => {
        const currentKey = getCurrentKey();
        const pngFiles = [];
        const jsonFiles = [];

        const subfolderMap = map.get(outerFolder).get(currentKey);
        if (subfolderMap instanceof Array) {
            const allFiles = subfolderMap;

            allFiles.forEach(file => {
                // Using MIME types instead of file extensions
                if (file.type === 'image/png') {
                    pngFiles.push(file);
                } else if (file.type === 'application/json') {
                    jsonFiles.push(file);
                }
            });
        }

        console.log("get json files" ,jsonFiles.length);
        console.log("get png files" ,pngFiles.length);

        return [pngFiles, jsonFiles];
    };


    const [pngFiles, jsonFiles] = getFilesForCurrentKey();

    return (
        <>
            <button onClick={handlePrevKey}>&lt;</button>
            <button onClick={handleNextKey}>&gt;</button>
            <h2>{getCurrentKey()}</h2>
            <Tinder
                pngFiles={pngFiles}
                jsonFiles={jsonFiles}
            />
        </>
    );
};

TinderParent.propTypes = {
    map: PropTypes.object.isRequired,
};

export default TinderParent;
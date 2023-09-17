import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Tinder from "./Tinder";

const TinderParent = ({ map }) => {
    const [currentKeyIndex, setCurrentKeyIndex] = useState(0);
    const outerFolder = Array.from(map.keys())[0]; // Assuming there's always at least one key, "gui_data" in your case
    const keys = Array.from(map.get(outerFolder).keys()); // Fetch the subfolder keys (001, 002, 003)
    const [resetCurrentPairIndex, setResetCurrentPairIndex] = useState(false);

    const resetCurrentPairIndexToZero = () => {
        setResetCurrentPairIndex((prevReset) => !prevReset);
    };
    //I added this function because, Tinder  failed to render anything when for e.x. (I am in the second
    //file of the second student and want to go to the first student, but he only has one file). This
    //solved the issue, but its a bit jittery when switching from that 2-2 to 1-1.

    const handleNextKey = () => {
        resetCurrentPairIndexToZero(); //To go to 0'th file on student change
        setCurrentKeyIndex((prevIndex) => (prevIndex + 1) % keys.length);
        getFilesForCurrentKey();
    };

    const handlePrevKey = () => {
        resetCurrentPairIndexToZero(); //To go to 0'th file on student change
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
                resetCurrentPairIndex={resetCurrentPairIndex} //To go to 0'th file on student change
            />
        </>
    );
};

TinderParent.propTypes = {
    map: PropTypes.object.isRequired,
};

export default TinderParent;
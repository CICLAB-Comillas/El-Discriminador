import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Tinder from './Tinder';

const TinderParent = ({ map }) => {
    const [currentKeyIndex, setCurrentKeyIndex] = useState(0);
    const keys = Object.keys(map);

    const handleNextKey = () => {
        setCurrentKeyIndex((prevIndex) => (prevIndex + 1) % keys.length);
    };

    const handlePrevKey = () => {
        setCurrentKeyIndex((prevIndex) => (prevIndex - 1 + keys.length) % keys.length);
    };

    const getCurrentKey = () => {
        return keys[currentKeyIndex];
    };

    return (
        <>
            <button onClick={handlePrevKey}>&lt;</button>
            <button onClick={handleNextKey}>&gt;</button>
            <Tinder
                pngFiles={map[getCurrentKey()]}
                jsonFiles={map[getCurrentKey()]}
            />
        </>
    );
};

TinderParent.propTypes = {
    map: PropTypes.object.isRequired, // Modify the prop type as per your specific map structure
};

export default TinderParent;






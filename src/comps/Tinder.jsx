// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const Tinder = ({ pngFiles, jsonFiles }) => {
    const [pngURLs, setPngURLs] = useState([]);
    const [currentPairIndex, setCurrentPairIndex] = useState(0);

    useEffect(() => {
        const getPngURLs = async () => {
            const urls = await Promise.all(
                pngFiles.map((file) => {
                    return new Promise((resolve) => {
                        const reader = new FileReader();
                        reader.onload = () => resolve(reader.result);
                        reader.readAsDataURL(file);
                    });
                })
            );
            setPngURLs(urls);
        };

        getPngURLs();
    }, [pngFiles]);

    const handleNext = () => {
        setCurrentPairIndex((prevIndex) => (prevIndex + 1) % pngURLs.length);
    };

    const handlePrev = () => {
        setCurrentPairIndex((prevIndex) =>
            prevIndex === 0 ? pngURLs.length - 1 : prevIndex - 1
        );
    };

    const currentPair = (
        <div className="pair-container">
                <div className="png-container">
                    <img src={pngURLs[currentPairIndex]} alt={`PNG ${currentPairIndex + 1}`} />
                </div>
                <div className="json-container">
                    <pre>{JSON.stringify(jsonFiles[currentPairIndex], null, 2)}</pre>
                </div>
        </div>
    );

    return (
        <>
        <div className="tinder-wrapper">
        <div className="tinder-container">
            {currentPair}

        </div>
        </div>
        <div className="button-container">
            <button onClick={handlePrev}>&lt;</button>
            <button onClick={handleNext}>&gt;</button>
        </div>
        </>
    );
};

Tinder.propTypes = {
    pngFiles: PropTypes.arrayOf(PropTypes.instanceOf(File)).isRequired,
    jsonFiles: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Tinder;

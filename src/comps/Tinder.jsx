import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import SaveButton from "./SaveButton";

const Tinder = ({ pngFiles, jsonFiles }) => {
  const [pngURLs, setPngURLs] = useState([]);
  const [jsonData, setJsonData] = useState([]);
  const [currentPairIndex, setCurrentPairIndex] = useState(0);
  const [userInputs, setUserInputs] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const pngURLs = await Promise.all(
        pngFiles.map((file) => {
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.readAsDataURL(file);
          });
        })
      );
      setPngURLs(pngURLs);

      const jsonContent = await Promise.all(
        jsonFiles.map((file) => {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
              try {
                const json = JSON.parse(reader.result);
                resolve(json);
              } catch (error) {
                reject(error);
              }
            };
            reader.readAsText(file);
          });
        })
      );
      setJsonData(jsonContent);
      setIsDataLoaded(true);
      setUserInputs(jsonContent.map(() => ({}))); // Initialize empty user inputs for each pair
    };

    fetchData();
  }, [pngFiles, jsonFiles]);

  const handleNext = () => {
    setCurrentPairIndex((prevIndex) => (prevIndex + 1) % pngURLs.length);
  };

  const handlePrev = () => {
    setCurrentPairIndex((prevIndex) =>
      prevIndex === 0 ? pngURLs.length - 1 : prevIndex - 1
    );
  };

  const handleSubjectChange = (event, title) => {
    setUserInputs((prevInputs) => {
      const updatedInputs = [...prevInputs];
      updatedInputs[currentPairIndex] = {
        ...updatedInputs[currentPairIndex],
        [title]: event.target.value
      };
      return updatedInputs;
    });
  };

  if (!isDataLoaded) {
    return <div>Loading...</div>;
  }

  const currentPair = (
    <div className="pair-container">
      <div className="image-container">
        <div className="png-container">
          <img src={pngURLs[currentPairIndex]} alt={`PNG ${currentPairIndex + 1}`} />
        </div>
        <div className="button-container">
          <div className="arrow-row">
            <button onClick={handlePrev}>&lt;</button>
            <button onClick={handleNext}>&gt;</button>
          </div>
          <div className="pair-indicator">
            {currentPairIndex + 1}/{pngURLs.length}
          </div>
        </div>
      </div>
      <div className="content-container">
        {jsonFiles[currentPairIndex] && jsonData[currentPairIndex] && (
          <div>
            <ul className="subject-list">
              {Object.entries(jsonData[currentPairIndex]).map(([title, subject]) => {
                const formattedTitle = title.replace(/_/g, ' '); // Replace underscores with spaces
                return (
                  <li key={title}>
                    <div className="subject-grade-container">
                      <div className="subject-box">
                        <div className="subject">{formattedTitle}</div>
                      </div>
                      <input
                        type="text"
                        className="subject-input"
                        placeholder="Enter subject text"
                        value={userInputs[currentPairIndex][title] || ''}
                        onChange={(event) => handleSubjectChange(event, title)}
                      />
                    </div>
                    <div className="subject-grade-container">
                      <div className="grade-box">
                        <div className="grade">{subject.grade}</div>
                      </div>
                      <input
                        type="text"
                        className="grade-input"
                        placeholder=""
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <div className="tinder-wrapper">
        <div className="tinder-container">{currentPair}</div>
      </div>
      {pngFiles.length > 0 && jsonFiles.length > 0 && (
        <div className="card">
          <SaveButton
            pngFile={pngFiles[currentPairIndex]}
            jsonFile={jsonFiles[currentPairIndex]}
            userInput={userInputs[currentPairIndex]}
          />
        </div>
      )}
    </>
  );
};

Tinder.propTypes = {
  pngFiles: PropTypes.arrayOf(PropTypes.instanceOf(File)).isRequired,
  jsonFiles: PropTypes.arrayOf(PropTypes.instanceOf(File)).isRequired,
};

export default Tinder;

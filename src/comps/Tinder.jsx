import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import SaveButton from './SaveButton';
import './Tinder.css';
import ImageZoomInOut from './ImageZoomInOut'; // Import the Zoomable Image component

const Tinder = ({ pngFiles, jsonFiles }) => {
  const [pngURLs, setPngURLs] = useState([]);
  const [jsonData, setJsonData] = useState([]);
  const [currentPairIndex, setCurrentPairIndex] = useState(0);
  const [userInputs, setUserInputs] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [zoom, setZoom] = useState(1); // State to manage zoom level

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pngURLs = await Promise.all(
          pngFiles.map(async (file) => {
            const url = await readFileAsDataURL(file);
            return url;
          })
        );

        const jsonContent = await Promise.all(
          jsonFiles.map(async (file) => {
            const content = await readFileAsText(file);
            return JSON.parse(content);
          })
        );

        setPngURLs(pngURLs);
        setJsonData(jsonContent);
        setIsDataLoaded(true);
        setUserInputs(jsonContent.map(() => ({}))); // Initialize empty user inputs for each pair
        setZoom(1); // Reset zoom when data changes
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    fetchData();
  }, [pngFiles, jsonFiles]);

  const handleNext = () => {
    setCurrentPairIndex((prevIndex) => (prevIndex + 1) % pngURLs.length);
    setZoom(1); // Reset zoom when moving to the next pair
  };

  const handlePrev = () => {
    setCurrentPairIndex((prevIndex) =>
      prevIndex === 0 ? pngURLs.length - 1 : prevIndex - 1
    );
    setZoom(1); // Reset zoom when moving to the previous pair
  };

  const handleSubjectChange = (event, title) => {
    setUserInputs((prevInputs) => {
      const updatedInputs = [...prevInputs];
      updatedInputs[currentPairIndex] = {
        ...updatedInputs[currentPairIndex],
        [title]: event.target.value,
      };
      return updatedInputs;
    });
  };

  if (!isDataLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="tinder-wrapper">
        <div className="tinder-container">
          <div className="pair-container">
            <div className="image-container">
              <div className="png-container">
                <ImageZoomInOut imageUrl={pngURLs[currentPairIndex]} zoom={zoom} />
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
                      let grades = [];

                      if (Array.isArray(subject.grade)) {
                        grades = subject.grade;
                      } else {
                        grades = [subject.grade];
                      }

                      return grades.map((grade, index) => {
                        const jsonPath = `${currentPairIndex}.${title}.grade[${index}]`;
                        console.log(jsonPath); // Log the JSON path to the console

                        return (
                          <li key={`${title}_${index}`}>
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
                                <div className="grade">{grade}</div>
                              </div>
                              <input
                                type="text"
                                className="grade-input"
                                placeholder=""
                              />
                            </div>
                          </li>
                        );
                      });
                    })}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {pngFiles.length > 0 && jsonFiles.length > 0 && (
        <div className="card">
          <SaveButton pngFiles={pngFiles} jsonFiles={jsonFiles} userInputs={userInputs} />
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

async function readFileAsDataURL(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });
}

async function readFileAsText(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsText(file);
  });
}
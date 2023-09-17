import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './Tinder.css';
import SaveButton from "./SaveButton.jsx";
import ImageZoomInOut from './ImageZoomInOut'; // Import the Zoomable Image component

const Tinder = ({map}) => {
  const [pngURLs, setPngURLs] = useState([]);
  const [jsonData, setJsonData] = useState([]);
  const [currentPairIndex, setCurrentPairIndex] = useState(0);
  const [userInputs, setUserInputs] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [zoom, setZoom] = useState(1); // State to manage zoom level
  const [currentKeyIndex, setCurrentKeyIndex] = useState(0);
  const outerFolder = Array.from(map.keys())[0]; // Assuming there's always at least one key, "gui_data" in your case
  const keys = Array.from(map.get(outerFolder).keys()); // Fetch the subfolder keys (001, 002, 003)


  const handleNextKey = () => {
        setCurrentPairIndex(0);
        setCurrentKeyIndex((prevIndex) => (prevIndex + 1) % keys.length);
        getFilesForCurrentKey();
    };

    const handlePrevKey = () => {
        setCurrentPairIndex(0);
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

            subfolderMap.forEach(file => {
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


    console.log("TINDER PARENT FILES", jsonFiles);
    console.log("TINDER PARENT FILES", pngFiles);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const pngURLs = await Promise.all(
          pngFiles.map(async (file) => {
            return await readFileAsDataURL(file);
          })
        );

        console.log("PNG URLS", pngFiles)

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
                <div className="Student-name-and-arrow-container">
                  <button onClick={handlePrevKey}>&lt; Previous</button>
                  <h1>{getCurrentKey()}</h1>
                  <button onClick={handleNextKey}>Next &gt;</button>
                </div>
              {jsonData[currentPairIndex] && (
                <div>
                  <ul className="subject-list">
                    {Object.entries(jsonData[currentPairIndex]).map(([subject_name, subject_properties]) => {
                      const formattedTitle = subject_name.replace(/_/g, ' '); // Replace underscores with spaces
                      let grades = [];

                      if (Array.isArray(subject_properties.grade)) {
                        grades = subject_properties.grade;
                      } else {
                        grades = [subject_properties.grade];
                      }

                      return grades.map((grade, index) => {
                      console.log(`Key for subject at index ${index}: ${subject_name}_${index}`);
                        return (
                          <li key={`${subject_name}_${index}`}>
                            <div className="subject-grade-container">
                              <div className="subject-box">
                                <div className="subject">{formattedTitle}</div>
                              </div>
                              <input
                                type="text"
                                className="subject-input"
                                placeholder="Enter subject text"
                                value={userInputs[currentPairIndex][subject_name] || ''}
                                onChange={(event) => handleSubjectChange(event, subject_name)}
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
          <SaveButton pngFiles={pngFiles} jsonFiles={jsonData} userInputs={userInputs} />
        </div>
      )}
    </>
  );
};
// It used to be like this: <SaveButton pngFiles={pngFiles} jsonFiles={jsonFiles} userInputs={userInputs} />
// But jsonFiles was passing information about the file, rather than the content


Tinder.propTypes = {
  map: PropTypes.object.isRequired,
};

export default Tinder

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
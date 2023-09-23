import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './Tinder.css';
import SaveButton from "./SaveButton.jsx";
import ImageZoomInOut from './ImageZoomInOut'; // Import the Zoomable Image component

const Tinder = ({map}) => {
    const [currentPairIndex, setCurrentPairIndex] = useState(0);
    const [userInputs, setUserInputs] = useState([]);
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [zoom, setZoom] = useState(1);
    const [currentKeyIndex, setCurrentKeyIndex] = useState(0);
    const [allpngFiles, setallPngFiles] = useState([]); // Declare pngFiles
    const [alljsonFiles, setallJsonFiles] = useState([]); // Declare jsonFile
    const [allpngURLs, setallPngURLs] = useState([]);
    const [alljsonData, setallJsonData] = useState([]);


  const outerFolder = Array.from(map.keys())[0];
  const keys = Array.from(map.get(outerFolder).keys());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentKey = getCurrentKey();
        const subfolderMap = map.get(outerFolder).get(currentKey);
        const pngFiles = [];
        const jsonFiles = [];
        const allpngFiles = [];
        const alljsonFiles =[];


        for (const key of keys) {
            const studentfolder = map.get(outerFolder).get(key);

            const auxpng=[];
            const auxjson=[];

            if (studentfolder instanceof Array) {
                studentfolder.forEach(file => {
                    if (file.type === 'image/png') {
                        auxpng.push(file);
                    } else if (file.type === 'application/json') {
                        auxjson.push(file);
                    }
                });
                allpngFiles.push(auxpng)
                alljsonFiles.push(auxjson)
            }
        }


        if (subfolderMap instanceof Array) {
          subfolderMap.forEach(file => {
            if (file.type === 'image/png') {
              pngFiles.push(file);
            } else if (file.type === 'application/json') {
              jsonFiles.push(file);
            }
          });
        }


        const allpngURLs = await Promise.all(
          allpngFiles.map(async (pngFilesArray) => {
            const pngURLs = await Promise.all(
              pngFilesArray.map(async (file) => {
                return await readFileAsDataURL(file);
              })
            );
            return pngURLs;
          })
        );


        const alljsonContent = await Promise.all(
          alljsonFiles.map(async (jsonFilesArray) => {
            const jsonContent = await Promise.all(
              jsonFilesArray.map(async (file) => {
                const content = await readFileAsText(file);
                return JSON.parse(content);
              })
            );
            return jsonContent;
          })
        );

        setallPngURLs(allpngURLs);
        setallJsonData(alljsonContent);
        setallPngFiles(allpngFiles);
        setallJsonFiles(alljsonFiles);
        setIsDataLoaded(true);
        setUserInputs(alljsonContent.map((content) => content.map(() => ({}))));
        setZoom(1);

      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    const getCurrentKey = () => {
      return keys[currentKeyIndex];
    };

    fetchData();
  }, [map, outerFolder]);


  const handleNextKey = () => {
        setCurrentPairIndex(0);
        setCurrentKeyIndex((prevIndex) => (prevIndex + 1) % keys.length);
    };

    const handlePrevKey = () => {
        setCurrentPairIndex(0);
        setCurrentKeyIndex((prevIndex) => (prevIndex - 1 + keys.length) % keys.length);
    };

    const getCurrentKey = () => {
        return keys[currentKeyIndex];
    };

  const handleNext = () => {
    setCurrentPairIndex((prevIndex) => (prevIndex + 1) % allpngURLs[currentKeyIndex].length);
    setZoom(1); // Reset zoom when moving to the next pair
  };

  const handlePrev = () => {
    setCurrentPairIndex((prevIndex) =>
      prevIndex === 0 ? allpngURLs[currentKeyIndex].length - 1 : prevIndex - 1
    );
    setZoom(1); // Reset zoom when moving to the previous pair
  };

  const handleSubjectChange = (event, title) => {
    setUserInputs((prevInputs) => {
      const updatedInputs = [...prevInputs];
      updatedInputs[currentKeyIndex][currentPairIndex] = {
        ...updatedInputs[currentKeyIndex][currentPairIndex],
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
                <ImageZoomInOut imageUrl={allpngURLs[currentKeyIndex][currentPairIndex]} zoom={zoom} />
              </div>
              <div className="button-container">
                <div className="arrow-row">
                  <button onClick={handlePrev}>&lt;</button>
                  <button onClick={handleNext}>&gt;</button>
                </div>
                <div className="pair-indicator">
                  {currentPairIndex + 1}/{allpngURLs[currentKeyIndex].length}
                </div>
              </div>
            </div>
            <div className="content-container">
                <div className="Student-name-and-arrow-container">
                  <button onClick={handlePrevKey}>&lt; Previous</button>
                  <h1>{getCurrentKey()}</h1>
                  <button onClick={handleNextKey}>Next &gt;</button>
                </div>
              {alljsonData[currentKeyIndex][currentPairIndex] && (
                <div>
                  <ul className="subject-list">
                    {Object.entries(alljsonData[currentKeyIndex][currentPairIndex]).map(([subject_name, subject_properties]) => {
                      const formattedTitle = subject_name.replace(/_/g, ' '); // Replace underscores with spaces
                      let grades = [];

                      if (Array.isArray(subject_properties.grade)) {
                        grades = subject_properties.grade;
                      } else {
                        grades = [subject_properties.grade];
                      }

                      return grades.map((grade, index) => {
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
                                value={userInputs[currentKeyIndex][currentPairIndex][subject_name] || ''}
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
      {allpngFiles.length > 0 && alljsonFiles.length > 0 && (
        <div className="card">
          <SaveButton pngFiles={allpngFiles} jsonFiles={alljsonData} userInputs={userInputs} />
        </div>
      )}
    </>
  );
};


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
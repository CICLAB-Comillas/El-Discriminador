import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
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
    const [selectedSubjects, setSelectedSubjects] = useState({});
    const [selectedSubjectsCount, setSelectedSubjectsCount] = useState(0); // State to track the count of selected subjects


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


  // Function to clear selected subjects when changing keys or pair index
  useEffect(() => {
    setSelectedSubjects({});
  }, [currentKeyIndex, currentPairIndex]);

  useEffect(() => {
    // Calculate the count of selected subjects whenever selectedSubjects changes
    const count = Object.values(selectedSubjects).filter((selected) => selected).length;
    setSelectedSubjectsCount(count);
  }, [selectedSubjects]);


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

  const handleSubjectChange = (event, subject_key) => {
      setUserInputs((prevInputs) => {
        const updatedInputs = [...prevInputs];
        const inputValue = event.target.value;

        if (inputValue === '') {
          delete updatedInputs[currentKeyIndex][currentPairIndex][`${subject_key}-name`];
        } else {
          updatedInputs[currentKeyIndex][currentPairIndex][`${subject_key}-name`] = inputValue;
        }

        return updatedInputs;
      });
  };

  const handleYearChange = (event, subject_key) => {
      setUserInputs((prevInputs) => {
        const updatedInputs = [...prevInputs];
        const inputValue = event.target.value;

        if (inputValue === '') {
          delete updatedInputs[currentKeyIndex][currentPairIndex][`${subject_key}-year`];
        } else {
          updatedInputs[currentKeyIndex][currentPairIndex][`${subject_key}-year`] = inputValue;
        }

        return updatedInputs;
      });
  };


  const handleGradeChange = (event, subject_key) => {
      setUserInputs((prevInputs) => {
        const updatedInputs = [...prevInputs];
        const inputValue = event.target.value;

        if (inputValue === '') {
          delete updatedInputs[currentKeyIndex][currentPairIndex][`${subject_key}-grade`];
        } else {
          updatedInputs[currentKeyIndex][currentPairIndex][`${subject_key}-grade`] = inputValue;
        }

        return updatedInputs;
      });
    };



  // Function to handle subject selection and color change
  const handleSubjectSelection = (event, subject_key) => {
    // Check if the clicked element is an input field or if text is being selected/highlighted
    if (
      event.target.tagName.toLowerCase() === 'input' ||
      window.getSelection().toString().length > 0
    ) {
      return; // Do nothing if it's an input or text is selected/highlighted
    }

    setSelectedSubjects((prevSelected) => {
      // Clone the previous selected subjects object
      const updatedSelected = { ...prevSelected };

      // Toggle the selection status of the subject
      updatedSelected[subject_key] = !updatedSelected[subject_key];

      return updatedSelected;
    });
  };


  // Function to get the background color for an <li> based on selection status
  const getLiStyles = (subject_key) => {
      const isSelected = selectedSubjects[subject_key];

      const backgroundColor = isSelected ? '#93a9d1' : '#dedede';
      const borderColor = isSelected ? '#93a9d1' : '#dedede';

      return { backgroundColor, borderColor };
};


const handleApplyChanges = () => {
  // Get the text from the input box
  const newText = document.querySelector(".subject-input-box").value;

  // Check if there are any selected subjects
  const isAnySubjectSelected = Object.values(selectedSubjects).some((selected) => selected);

  if (isAnySubjectSelected) {
    // Loop through the selected subjects
    Object.keys(selectedSubjects).forEach((subject_key) => {
      if (selectedSubjects[subject_key]) {
        // Update the year text for each selected subject
        setUserInputs((prevInputs) => {
          const updatedInputs = [...prevInputs];

          // Update the year text for the current subject
          updatedInputs[currentKeyIndex][currentPairIndex][`${subject_key}-year`] = newText;

          return updatedInputs;
        });
      }
    });

    // Clear selections
    setSelectedSubjects({});

    // Clear the text from the input box
    document.querySelector(".subject-input-box").value = '';
  }
};


const handleDiscardChanges = () => {
  // Unselect all subjects
  setSelectedSubjects({});

  // Clear the text from the input box
  document.querySelector(".subject-input-box").value = '';
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
                    {Object.entries(alljsonData[currentKeyIndex][currentPairIndex]).map(([subject_key, subject_properties]) => {
                      let subject_grade = parseFloat(subject_properties.grade);
                      let subject_name = subject_properties.name;
                      let subject_year = subject_properties.year;

                      return (
                        <li
                            key={`${subject_key}`}
                            style={getLiStyles(subject_key)} // Apply background and border colors dynamically
                            onClick={(event) => handleSubjectSelection(event, subject_key)} // Handle click to select/deselect
                        >
                          <div className="subject-grade-container">
                            <div className="subject-box">
                              <div className="subject">{subject_name}</div>
                            </div>
                            <input
                              type="text"
                              className="subject-input"
                              placeholder="Enter subject text"
                              value={userInputs[currentKeyIndex][currentPairIndex][`${subject_key}-name`] || ''}
                              onChange={(event) => handleSubjectChange(event, subject_key)}
                            />
                          </div>
                          <div className="subject-grade-container">
                            <div className="year-box">
                              <div className="year">{subject_year}</div>
                            </div>
                            <input
                              type="text"
                              className="year-input"
                              placeholder="Enter subject year"
                              value={userInputs[currentKeyIndex][currentPairIndex][`${subject_key}-year`] || ''}
                              onChange={(event) => handleYearChange(event, subject_key)}
                            />
                          </div>
                          <div className="subject-grade-container">
                            <div className="grade-box">
                              <div className="grade">{subject_grade}</div>
                            </div>
                            <input
                              type="text"
                              className="grade-input"
                              placeholder=""
                              value={userInputs[currentKeyIndex][currentPairIndex][`${subject_key}-grade`] || ''}
                              onChange={(event) => handleGradeChange(event, subject_key)}
                            />
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                    <div className="selected-subjects-container">
                      <div className="selected-subjects-text">
                        {selectedSubjectsCount}/{Object.keys(alljsonData[currentKeyIndex][currentPairIndex]).length} subjects selected
                      </div>
                      <input
                        type="text"
                        className="subject-input-box"
                        placeholder="Introduce new year"
                        // Add your input handling logic here
                      />
                    <button className="apply-button" onClick={handleApplyChanges}>
                      Apply
                    </button>
                    <button className="discard-button" onClick={handleDiscardChanges}>
                      Discard
                    </button>
                  </div>
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
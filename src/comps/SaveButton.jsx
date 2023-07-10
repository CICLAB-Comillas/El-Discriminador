import React from 'react';
import PropTypes from 'prop-types';
import JSZip from 'jszip';

const SaveButton = ({ pngFile, jsonFile, userInputs }) => {
  const handleSave = () => {
    const zip = new JSZip();

    // Create a folder for the pair of PNG and JSON data
    const folder = zip.folder('pair');

    // Add the PNG file to the folder
    folder.file('image.png', pngFile);

    // Add the JSON file to the folder
    const jsonFileName = 'data.json';
    const jsonDataString = JSON.stringify(jsonFile, null, 2);
    folder.file(jsonFileName, jsonDataString);

    // Add the JSON with user input to the folder
    const userInputFileName = 'user_input.json';
    const userInputDataString = JSON.stringify(userInputs, null, 2);
    folder.file(userInputFileName, userInputDataString);

    // Generate the ZIP file asynchronously
    zip.generateAsync({ type: 'blob' }).then((content) => {
      // Create a download link and trigger the download
      const downloadLink = document.createElement('a');
      const zipFileName = 'folder.zip';
      downloadLink.href = URL.createObjectURL(content);
      downloadLink.download = zipFileName;
      downloadLink.click();
    });
  };

  console.log('pngFile:', pngFile);
  console.log('jsonFile:', jsonFile);
  console.log('userInputs:', userInputs);

  return (
    <div>
      <button onClick={handleSave}>Save as ZIP</button>
    </div>
  );
};

SaveButton.propTypes = {
  pngFile: PropTypes.instanceOf(File).isRequired,
  jsonFile: PropTypes.object.isRequired,
  userInputs: PropTypes.object.isRequired,
};

export default SaveButton;

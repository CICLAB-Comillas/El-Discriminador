import PropTypes from 'prop-types';
import JSZip from 'jszip';

const SaveButton = ({ pngFiles, jsonFiles, userInputs }) => {
  const handleSave = () => {
    const zip = new JSZip();

    // Iterate over all pairs
    for (let i = 0; i < pngFiles.length; i++) {
      const pairFolder = zip.folder(`pair${i + 1}`);

      // Add the PNG file to the pair folder
      pairFolder.file('image.png', pngFiles[i]);

      // Add the JSON file to the pair folder
      const jsonFileName = `data${i + 1}.json`;
      const jsonDataString = JSON.stringify(jsonFiles[i], null, 2);
      pairFolder.file(jsonFileName, jsonDataString);

      // Add the JSON with user input to the pair folder
      const userInputFileName = `user_input${i + 1}.json`;
      const userInputDataString = JSON.stringify(userInputs[i], null, 2);
      pairFolder.file(userInputFileName, userInputDataString);
    }

    // Generate the ZIP file asynchronously
    zip.generateAsync({ type: 'blob' }).then((content) => {
      // Create a download link and trigger the download
      const downloadLink = document.createElement('a');
      const zipFileName = 'pairs.zip';
      downloadLink.href = URL.createObjectURL(content);
      downloadLink.download = zipFileName;
      downloadLink.click();
    });
  };

  return (
    <div>
      <button onClick={handleSave}>Save All Pairs as ZIP</button>
    </div>
  );
};

SaveButton.propTypes = {
  pngFiles: PropTypes.arrayOf(PropTypes.instanceOf(File)).isRequired,
  jsonFiles: PropTypes.arrayOf(PropTypes.object).isRequired,
  userInputs: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default SaveButton;

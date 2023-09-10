import React from 'react';
import PropTypes from 'prop-types';
import JSZip from 'jszip';

const SaveButton = ({ folderData }) => {
  const handleSave = () => {
    const zip = new JSZip();

    folderData.forEach(({ folderName, pngFiles, jsonFiles }) => {
      const studentFolder = zip.folder(folderName);

      // Add PNG files to the student's folder
      pngFiles.forEach((pngFile, index) => {
        studentFolder.file(`image_${index + 1}.png`, pngFile);
      });

      // Add JSON files to the student's folder
      jsonFiles.forEach((jsonFile, index) => {
        studentFolder.file(`data_${index + 1}.json`, JSON.stringify(jsonFile, null, 2));
      });
    });

    // Generate the ZIP file asynchronously
    zip.generateAsync({ type: 'blob' }).then((content) => {
      // Create a download link and trigger the download
      const downloadLink = document.createElement('a');
      const zipFileName = 'student_data.zip';
      downloadLink.href = URL.createObjectURL(content);
      downloadLink.download = zipFileName;
      downloadLink.click();
    });
  };

  return (
    <div>
      <button onClick={handleSave}>Save All Student Data as ZIP</button>
    </div>
  );
};

SaveButton.propTypes = {
  folderData: PropTypes.arrayOf(
    PropTypes.shape({
      folderName: PropTypes.string.isRequired,
      pngFiles: PropTypes.arrayOf(PropTypes.instanceOf(File)).isRequired,
      jsonFiles: PropTypes.arrayOf(PropTypes.object).isRequired,
    })
  ),
};

export default SaveButton;

import React, { useState } from 'react';
import UploadButton from "./comps/UploadButton";
import './App.css';
import Tinder from "./comps/Tinder.jsx";
import SaveButton from "./comps/SaveButton";

function App() {
    const [pngFiles, setPngFiles] = useState([]);
    const [jsonFiles, setJsonFiles] = useState([]);
    const [userInputs, setUserInputs] = useState({});

    const handleFileUpdate = (newPngFiles, newJsonFiles) => {
        setPngFiles(newPngFiles);
        setJsonFiles(newJsonFiles);
    };

    const handleUserInputsChange = (inputs) => {
        setUserInputs(inputs);
    };

    return (
        <div className={"big-wrapper"}>
            <div>
                <a href="https://github.com/CICLAB-Comillas" target="_blank" rel="noreferrer">
                    <img src="src/assets/logo-ciclab.png" className="logo ciclab" alt="CICLAB logo" />
                </a>
            </div>
            <h1>El Discriminador v.2</h1>
            <h2>Applicant filtering system</h2>
            <h5>
                by:
                <br /> A. Gómez, M. Hervás
                <br /> M. Liz, A. Quintana
            </h5>

            <div className="card">
                <UploadButton onFileUpload={handleFileUpdate} />
                <br />
                {pngFiles.length > 0 && jsonFiles.length > 0 && (
                    <div>
                        <div className={"fileDisplay"}><p>{"Upload Successful"}</p></div>
                    </div>
                )}
            </div>

            {pngFiles.length > 0 && jsonFiles.length > 0 && (
                <div className="card">
                    <Tinder pngFiles={pngFiles} jsonFiles={jsonFiles} onUserInputsChange={handleUserInputsChange} />
                </div>
            )}

            <p className="read-the-docs">
                {/* eslint-disable-next-line react/no-unescaped-entities */}
                "El que vale vale y el que no, a ICADE" <br />
                - El Discriminador.
            </p>
            <p className="read-the-docs">
                To learn more click on the CICLAB logo or visit {'https://github.com/CICLAB-Comillas'}
            </p>
        </div>
    );
}

export default App;

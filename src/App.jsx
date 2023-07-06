// // eslint-disable-next-line no-unused-vars
// import React, { useState } from 'react';
// import UploadButton from "./comps/UploadButton.jsx";
// import './App.css';
// import Tinder from "./comps/Tinder.jsx";


// function App() {
//     const [pngFiles, setPngFiles] = useState([]);
//     const [jsonFiles, setJsonFiles] = useState([]);

//     const handleFileUpdate = (newPngFiles, newJsonFiles) => {
//         setPngFiles(newPngFiles);
//         setJsonFiles(newJsonFiles);
//     };

//     return (
//         <div className={"big-wrapper"}>
//             <div>
//                 <a href="https://github.com/CICLAB-Comillas" target="_blank" rel="noreferrer">
//                     <img src="src/assets/logo-ciclab.png" className="logo ciclab" alt="CICLAB logo" />
//                 </a>
//             </div>
//             <h1>El Discriminador v.2</h1>
//             <h2>Applicant filtering system</h2>
//             <h5>
//                 by:
//                 <br /> A. Gómez, M. Hervás
//                 <br /> M. Liz, A. Quintana
//             </h5>

//             <div className="card">
//                 <UploadButton onFileUpload={handleFileUpdate} />
//                 <br />
//                 {pngFiles.length > 0 && jsonFiles.length > 0 && (
//                     <div>
//                         <h4>Status:</h4>
//                         <div className={"fileDisplay"}><p>{"Upload Succesful"}</p></div>
//                     </div>
//                 )}
//             </div>

//             {pngFiles.length > 0 && jsonFiles.length > 0 && (
//                 <div className="card">
//                     <Tinder pngFiles={pngFiles} jsonFiles={jsonFiles} />
//                 </div>
//             )}


//             <p className="read-the-docs">
//                 {/* eslint-disable-next-line react/no-unescaped-entities */}
//                 "El que vale vale y el que no, a ICADE" <br />
//                 - El Discriminador.
//             </p>
//             <p className="read-the-docs">
//                 To learn more clicks on the CICLAB logo or visit {'https://github.com/CICLAB-Comillas'}
//             </p>
//         </div>
//     );
// }

// export default App;

// eslint-disable-next-line no-unused-vars
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import UploadButton from "./comps/UploadButton.jsx";
import './App.css';
import Tinder from "./comps/Tinder.jsx";
import Notas from "./comps/Notas.jsx";
import Botones from "./comps/Botones.jsx";

function App() {
    const [pngFiles, setPngFiles] = useState([]);
    const [jsonFiles, setJsonFiles] = useState([]);
    const [currentPngIndex, setCurrentPngIndex] = useState(0);

    const handleFileUpdate = (newPngFiles, newJsonFiles) => {
        setPngFiles(newPngFiles);
        setJsonFiles(newJsonFiles);
    };

    const handlePreviousPng = () => {
        setCurrentPngIndex(prevIndex => (prevIndex > 0 ? prevIndex - 1 : 0));
    };

    const handleNextPng = () => {
        setCurrentPngIndex(prevIndex => (prevIndex < pngFiles.length - 1 ? prevIndex + 1 : prevIndex));
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
                        <div className="linea-en-blanco"></div>

                        {/* <h4>Status:</h4> */}
                        <div className={"fileDisplay"}>
                            <div className="column">
                                <div className="column analyzed-document">
                                    <h5>DOCUMENTO ANALIZADO:</h5>
                                    <div className="fileNavigation">
                                        <img
                                            src={URL.createObjectURL(pngFiles[currentPngIndex])}
                                            alt="PNG File"
                                            style={{ width: '300px', height: 'auto' }}
                                        />
                                        <button onClick={handlePreviousPng}>&#8249;</button>
                                        <button onClick={handleNextPng}>&#8250;</button>
                                    </div>
                                </div>
                            </div>
                            <div className="column">
                                <div className="column subjects">

                                    <h5>ASIGNATURAS:</h5>
                                    {jsonFiles.map((file, index) => (
                                        <p key={index}>{file.name}</p>
                                    ))}
                                </div>
                            </div>
                            <div className="column">
                                <div className="column notes">
                                    <h5>NOTAS:</h5>
                                    <Notas />
                                    {/* Contenido de la tercera columna */}
                                </div>
                            </div>
                        </div>
                        <Botones />
                    </div>
                )}
            </div>

            <p className="read-the-docs">
                {/* eslint-disable-next-line react/no-unescaped-entities */}
                "El que vale vale y el que no, a ICADE" <br />
                - El Discriminador.
            </p>
            <p className="read-the-docs">
                To learn more clicks on the CICLAB logo or visit {'https://github.com/CICLAB-Comillas'}
            </p>
        </div>
    );
}

export default App;

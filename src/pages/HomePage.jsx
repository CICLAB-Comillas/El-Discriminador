import { UploadButton } from '../comps/UploadButton.jsx';
import React, { useState } from 'react';

<<<<<<< HEAD:src/App.tsx
import './App.css'
import './comps/UploadButton.css'
import {UploadButton} from "./comps/UploadButton.tsx";
import {useState} from "react";

function App() {

=======
function HomePage() {
>>>>>>> main:src/pages/HomePage.jsx
    const [file, setFile] = useState(null);

    const handleFileUpdate = (newFile) => {
        setFile(newFile);
    };

    return (
        <>
            <div>
                <a href="https://github.com/CICLAB-Comillas" target="_blank" rel="noreferrer">
                    <img src="src/assets/logo-ciclab.png" className="logo ciclab" alt="CICLAB logo" />
                </a>
            </div>
            <h1>El Discriminador</h1>
            <h2>Applicant filtering system</h2>
            <h5>
                by:
                <br /> A. Gómez, M. Hervás
                <br /> M. Liz, A. Quintana
            </h5>

            <div className="card">
                <UploadButton onFileUpload={handleFileUpdate} />
            </div>

            <p className="read-the-docs">
                "El que vale vale y el que no, a ICADE" <br />
                - El Discriminador.
            </p>
            <p className="read-the-docs">
                To learn more clicks on the CICLAB logo or visit {'https://github.com/CICLAB-Comillas'}
            </p>
        </>
    );
}

export default HomePage;


import './App.css'
import { UploadButton } from "./comps/UploadButton.tsx";
import { Asignaturas } from "./comps/Asignaturas.tsx";
import { useState } from "react";
import image from './comps/image.png';

function App() {

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
            <h5>by:
                <br /> A. Gómez, M. Hervás
                <br /> M. Liz, A. Quintana
            </h5>


            <div className="card">
                <UploadButton onFileUpload={handleFileUpdate} />
            </div>

            <div className="container">
                <div className="column">
                    Documento analizado
                    {/* Agrega tus componentes debajo de esta columna */}
                    <img src={image} alt="Foto" />

                    {/* ... */}
                </div>
                <div className="column">
                    Asignaturas
                    {/* Agrega tus componentes debajo de esta columna */}
                    <Asignaturas />
                    {/* <Componente4 /> */}
                    {/* ... */}
                </div>
                <div className="column">
                    Notas
                    {/* Agrega tus componentes debajo de esta columna */}
                    {/* <Componente5 />
                    <Componente6 /> */}
                    {/* ... */}
                </div>
            </div>


            <p className="read-the-docs">
                "El que vale vale y el que no, a ICADE" <br />
                - El Discriminador.
            </p>
            <p className="read-the-docs">
                To learn more clicks on the CICLAB logo or visit {'https://github.com/CICLAB-Comillas'}
            </p>
        </>

    )
}

export default App

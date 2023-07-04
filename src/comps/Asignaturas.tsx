import React, { useState } from 'react';
import './Asignaturas.css'


export const Asignaturas = () => {
    const [manualName, setManualName] = useState('');
    const predefinedName = "Matemáticas";

    const handleInputChange = (e) => {
        setManualName(e.target.value);
    };

    return (
        <div className="container">
            <div className="column2">
                <div>{predefinedName}</div>
            </div>
            <div className="column2">
                <input type="text" value={manualName} onChange={handleInputChange} />
            </div>
        </div>
    );
};



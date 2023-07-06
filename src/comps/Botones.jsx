import React, { useState } from 'react';

const Botones = () => {
    const [text, setText] = useState('');
    //HAY QUE CAMBIAR LAS FUNCIONES DE QUÉ HACE CADA BOTON PARA TENERLO VINCULADO AL JSON
    // const [editedText, setEditedText] = useState('');

    const handleAcceptChanges = () => {
        // setText(editedText);
        // setEditedText('');
    };

    const handleDiscardChanges = () => {
        // setEditedText('');
    };

    return (
        <div>
            <p>¿Qué desea hacer?: {text}</p>
            <button style={{ backgroundColor: 'green', color: 'white', marginRight: '10px' }} onClick={handleAcceptChanges}>Aceptar</button>
            <button style={{ backgroundColor: 'red', color: 'white' }} onClick={handleDiscardChanges}>Descartar</button>
        </div>
    );
};

export default Botones;

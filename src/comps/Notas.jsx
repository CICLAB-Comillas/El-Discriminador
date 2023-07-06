import React, { useState } from 'react';

//DE MOMENTO SOLO TIENE UN CUADRO DE TEXTO PARA RELLENAR
const Notas = () => {
    const [text, setText] = useState('');

    const handleTextChange = (e) => {
        setText(e.target.value);
    };

    return (
        <div>
            <input
                type="text"
                value={text}
                onChange={handleTextChange}
            />
            <p>Texto actual: {text}</p>
        </div>
    );
};

export default Notas;

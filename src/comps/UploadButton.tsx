
// VERSIÓN 4.0 
import React, { useRef, useState, ChangeEvent } from 'react';

interface UploadButtonProps {
    tagText?: string;
    onFileUpload: (file: string) => void;
}

export const UploadButton: React.FC<UploadButtonProps> = ({ tagText = "UPLOAD A FILE", onFileUpload }) => {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [fileURL, setFileURL] = useState('');

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files && event.target.files[0];
        if (file) {
            setSelectedFile(file);

            const reader = new FileReader();
            reader.onload = () => {
                const fileContent = reader.result;
                // Aquí puedes hacer algo con el contenido del archivo, como mostrarlo en la interfaz de usuario.
                console.log(fileContent);
            };
            reader.readAsText(file);

            // Guarda el archivo como una URL
            const fileURL = URL.createObjectURL(file);
            setFileURL(fileURL);


            // Call the passed in prop function
            onFileUpload(fileURL);
        }
    };

    return (
        <div>
            <button onClick={handleClick} className="tag">
                <div className="tag-text">{tagText}</div>
            </button>

            <input
                ref={fileInputRef}
                type="file"
                accept=".mp3, .mp4, .svg, .wav, .flac, .aac, .m4a, .ogg, .aiff, .aif, .weba"
                style={{ display: 'none' }}
                onChange={handleFileChange}
            />

            {selectedFile && (
                <div>
                    <h4>Selected File:</h4>
                    <p className={"fileDisplay"}>{selectedFile.name}</p>
                </div>
            )}
        </div>
    );
};

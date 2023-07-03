// VERSIÓN 4.0
import React, { useRef, useState, ChangeEvent } from 'react';

interface UploadButtonProps {
  tagText?: string;
  onFolderUpload: (fileUrls: string[]) => void;
}

export const UploadButton: React.FC<UploadButtonProps> = ({ tagText = "UPLOAD", onFolderUpload }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFolder, setSelectedFolder] = useState<File | null>(null);
  const [fileURLs, setFileURLs] = useState<string[]>([]);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const folder = files[0];
      setSelectedFolder(folder);

      const fileURLs: string[] = [];
      const readerPromises: Promise<string>[] = [];

      const entries = folder.webkitEntries || folder.entries || [];

      const readEntries = (entries: any) => {
        const reader = new FileReader();
        const readerPromise = new Promise<string>((resolve) => {
          reader.onload = () => {
            const fileContent = reader.result as string;
            resolve(fileContent);
          };
        });

        entries.forEach((entry: any) => {
          if (entry.isFile) {
            const file = entry.file((file: any) => {
              const fileURL = URL.createObjectURL(file);
              fileURLs.push(fileURL);
              reader.readAsText(file);
            });
          } else if (entry.isDirectory) {
            const reader = entry.createReader();
            reader.readEntries(readEntries);
          }
        });

        readerPromises.push(readerPromise);
      };

      readEntries(entries);

      Promise.all(readerPromises).then(() => {
        onFolderUpload(fileURLs);
      });

      setFileURLs(fileURLs);
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
        style={{ display: 'none' }}
        onChange={handleFileChange}
        webkitdirectory="true"
        directory="true"
      />

      {selectedFolder && (
        <div>
          <h4>Selected Folder:</h4>
          <div className="folderDisplay">
            <span className="folderIcon">&#128193;</span>
            <p className="folderName">{selectedFolder.name}</p>
          </div>
        </div>
      )}
    </div>
  );
};

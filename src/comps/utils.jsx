const extractFolderNames = (files) => {
    const folderMap = new Map();

    for (const file of files) {
        const path = file.webkitRelativePath || file.mozRelativePath || file.relativePath || file.name;
        const [mainFolder, subfolder, ...rest] = path.split('/');

        if (!folderMap.has(mainFolder)) {
            folderMap.set(mainFolder, new Map());
        }

        if (subfolder) {
            const subfolderMap = folderMap.get(mainFolder);
            if (!subfolderMap.has(subfolder)) {
                subfolderMap.set(subfolder, []);
            }
            subfolderMap.get(subfolder).push(file);
        }
    }

    console.log('Folder Map:', folderMap); // Log the final folderMap
    return folderMap;
};

const fs = require('fs');
const path = require('path');
const projectPath = 'public/static';

function traverseDirectory(directory, fileList) {
    const files = fs.readdirSync(directory);

    files.forEach((file) => {
        const filePath = path.join(directory, file);
        const fileStat = fs.statSync(filePath);

        if (fileStat.isDirectory()) {
            traverseDirectory(filePath, fileList);
        } else if (file.toLowerCase().endsWith('.svg') || file.toLowerCase().endsWith('.ttf')) {
            fileList.push(filePath);
        }
    });
}

const assetFiles = [];

traverseDirectory(projectPath, assetFiles);

const assetFilesObject = { files: assetFiles };
const jsonFilePath = path.join(projectPath, 'build/assets.json');

fs.writeFileSync(jsonFilePath, JSON.stringify(assetFilesObject, null, 2));

console.log(`JSON файл со списком SVG и TTF файлов создан: ${jsonFilePath}`);

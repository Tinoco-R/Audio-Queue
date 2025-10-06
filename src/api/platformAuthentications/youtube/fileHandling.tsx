'use server';

import fs from 'fs';
import { readFile } from 'fs';

// Write text to a file
export async function writeToFile(data: any, name: string) {
    let fileName = `src/api/platformAuthentications/data/${name}.json`;

    try {
        fs.writeFile(fileName, JSON.stringify(data, null, 2), 'utf8', (err) => {
            if (err) {
                console.error('Error writing files:', err);
            } else {
                console.log('Files created successfully');
            }
        });
    }
    catch (err) {
        console.error('Error writing files:', err);
    }
}

// Read from a file
export async function readFromFile(name: string) {
    try {
        let fileName = `src/api/platformAuthentications/data/${name}.json`;
        
        // Read JSON data from a file
        const data = await new Promise<string>((resolve, reject) => {
            readFile(fileName, 'utf8', (err, content) => {
                if (err) reject(err);
                else resolve(content);
            });
        });

        const parsedData = JSON.parse(data);
        console.log('Read data from file:', parsedData);
        return parsedData;
    }
    catch (err) {
        console.error('Error reading file:', err);
    }
}
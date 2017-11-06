// tslint:disable:no-console
import * as path from 'path';
import * as fs from 'fs';

const outputFilename = path.join(__dirname, 'feedOutput.json');
const data = { testing: 123, at: new Date().toISOString() };
fs.writeFile(outputFilename, JSON.stringify(data), (err) => {
    if (err) {
        console.error(err);
    } else {
        console.log('JSON saved to ' + outputFilename);
    }
});
const XLSX = require('xlsx');
const fs = require('fs');


// Function to process the data
function processColumns(data) {
    const processedData = [];

    for (let col = 0; col < data[0].length; col += 3) { // Skip by 3 columns each time
        let columnPair = [];
        for (let row = 0; row < data.length; row++) {
            // Check if both cells in the pair have data
            if (data[row][col] != null && data[row][col + 1] != null) {
                columnPair.push([data[row][col], data[row][col + 1]]);
            }
        }
        processedData.push(columnPair);
    }

    return processedData;
}

const paths = ['/Users/emilejohnston/Documents/Language/Lernen Deutsch l20.xlsx',
    '/Users/emilejohnston/Documents/Language/učiť sa po slovensky l20.xlsx']
let results = [];

for (const path of paths) {
    // Read the .xlsx files
    const workBook = XLSX.readFile(path);
    const sheet = workBook.Sheets[workBook.SheetNames[0]];

    // Convert the sheet to JSON, but keep it in an array of arrays format
    const data = XLSX.utils.sheet_to_json(sheet, {header: 1});
    data.shift(); // Remove the first row because it's just headers
    const processedData = processColumns(data);
    results.push(processedData);
    // console.log(jsonString); // print the resulting lists to the console
}

const jsonString = JSON.stringify([
    {
        "Deutsch": {
            "lists": results[0]
        },
        "slovensky": {
            "lists": results[1]
        }
    }
], null, 2);


// Write the JSON string to a file
fs.writeFile('/Users/emilejohnston/IdeaProjects/Web_app/vortoj.json', jsonString, 'utf8', err => {
    if (err) {
        console.error(err);
    } else {
        console.log('File successfully written');
    }
});
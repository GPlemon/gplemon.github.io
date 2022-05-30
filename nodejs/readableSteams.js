/* reading and writing to files line-by-line. */
import { createInterface } from 'readline';
import fs from 'fs';

let settings = {
  input: createReadStream('shoppingList.txt')
};

const myInterface = createInterface(settings);

const printData = (data) => {
  console.log(`Item: ${data}`);
};

myInterface.on('line', printData);



//Writeable Streams

const fileStream = fs.createWriteStream('shoppingResults.txt');

let transformData = (line) => {
 fileStream.write(`They were out of: ${line}\n`); 
};

myInterface.on('line', transformData);
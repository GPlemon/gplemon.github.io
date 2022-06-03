"use strict";
import express from 'express';
import { readFile, readFileSync, writeFile, writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import jsdom from "jsdom";
const { JSDOM } = jsdom;


const dom = new JSDOM(`<!DOCTYPE html><p>Hello world</p>`);
console.log(dom.window.document.querySelector("p").textContent); // "Hello world"



const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);

let app = express()



app.get('/', (req, res) => {
    res.send('Hello World!')

})



app.listen(3000, () => {
    console.log(`server at http://localhost:${3000}/`)
})

/* 
let counter = "10";

try {
    writeFileSync('./count.txt', counter)
} catch (err) {
    console.error(err)
}

app.get('/', async(req, res) => {
    counter = readFileSync('./count.txt', 'utf8', async(err, data) => {
        if (err) {
            return console.log(err);
        }

        console.log(data);
        return data
    });

    
    const newCount = parseInt(counter) - 1


    try {
        writeFileSync('./count.txt', newCount.toString())
    } catch (err) {
        console.error(err)
    }
    if (newCount >= 0) {
        res.send(`
        <!DOCTYPE html>
        <h5>${req.protocol +'://'+ req.get('HOST')+req.originalUrl}</h5>
        <h5>${newCount}</h5>
        </html>
        `)
    } else {
        try {
            res.sendFile('/base.html', { root: String(path.join(__dirname)) })

        } catch (error) {
            console.error(error)
        }

    }

})

 */
const express = require('express');
const app = express();

app.use(express.static(__dirname)); // allows CSS to load

app.get('/lesson4', (req, res) => {
    let limit = parseInt(req.query.num) || 10;

    let output = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Lesson 4 - Assignment4</title>
        <link rel="stylesheet" href="/styles.css">
    </head>
    <body>
        <h1>Assignment 4 - Even or Odd Numbers</h1>
        <p>Showing numbers from 1 to ${limit}</p>
        <ul>
    `;

    for (let i = 1; i <= limit; i++) {
        if (i % 2 === 0) {
            output += `<li>${i} is EVEN</li>`;
        } else {
            output += `<li>${i} is ODD</li>`;
        }
    }

    output += `
        </ul>
        <a href="/">Go Back</a>
    </body>
    </html>
    `;

    res.send(output);
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});

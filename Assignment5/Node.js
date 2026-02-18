const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 8080;

const storage = multer.diskStorage({
    destination: './uploads/',
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });


app.use(express.static('./'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Process Uploaded Text File
app.post('/lesson5', upload.single('userFile'), (req, res) => {
    if (!req.file) {
        return res.send('Please upload a file.');
    }


    const filePath = path.join(__dirname, req.file.path);
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading file.');
        }

        res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <link rel="stylesheet" href="/styles.css">
                <title>Lesson 5 - Result</title>
            </head>
            <body>
                <nav><a href="/">Back to Home</a></nav>
                <h1>File Processed Successfully</h1>
                <p><strong>File Name:</strong> ${req.file.originalname}</p>
                <div class="content-box">
                    <h3>File Content:</h3>
                    <pre>${data}</pre>
                </div>
            </body>
            </html>
        `);
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

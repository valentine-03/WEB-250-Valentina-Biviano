/**
 * WEB 250: Assignment 12 - REST API Server
 * Valentina Biviano
 * 4/16/2026
 */

const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(__dirname));

// Data Structure
let wildfireRecords = [
    { id: 1, location: "Forest Park", acresBurned: 120, dateReported: "2026-04-01" }
];

// Processing functions

const getRecords = (data) => data;

const findRecordIndex = (data, id) => data.findIndex(r => r.id === parseInt(id));

// REST 

app.get('/api/records', (req, res) => {
    res.json(getRecords(wildfireRecords));
});

// POST
app.post('/api/records', (req, res) => {
    const newRecord = {
        id: Date.now(), // Unique ID using timestamp
        location: req.body.location,
        acresBurned: Number(req.body.acresBurned),
        dateReported: req.body.dateReported
    };
    wildfireRecords.push(newRecord);
    res.status(201).json(newRecord);
});

// PUT
app.put('/api/records/:id', (req, res) => {
    const index = findRecordIndex(wildfireRecords, req.params.id);
    if (index !== -1) {
        wildfireRecords[index] = { 
            id: parseInt(req.params.id), 
            ...req.body 
        };
        res.json(wildfireRecords[index]);
    } else {
        res.status(404).send('Record not found');
    }
});

// DELETE
app.delete('/api/records/:id', (req, res) => {
    const index = findRecordIndex(wildfireRecords, req.params.id);
    if (index !== -1) {
        wildfireRecords.splice(index, 1);
        res.status(204).send();
    } else {
        res.status(404).send('Record not found');
    }
});

// Route to serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
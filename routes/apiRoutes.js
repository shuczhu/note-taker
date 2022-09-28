const api = require('express').Router();
const { readFromFile, readAndAppend, writeToFile } = require('../helpers/fsUtils');
const uuid = require('../helpers/uuid');

api.get("/notes", (req, res) => {
    readFromFile("./db/db.json").then((data)=> res.json(JSON.parse(data)))
});

api.post("/notes", (req, res) => {

    const { title, text} = req.body;

    if (title && text) {
        const newNote = {
            title,
            text,
            id: uuid()
        };

        readAndAppend(newNote, "./db/db.json");

        const response = {
            status: 'success',
            body: newNote
        };

        res.json(response);
    } else {
        res.json("Error in Posting Notes");
    }

});


api.delete("/notes/:id", (req, res) => {
    const noteId = req.params.id;
    readFromFile('./db/db.json')
    .then((data)=> JSON.parse(data))
    .then((json)=> {
        const result = json.filter((note)=> note.id !== noteId);
        writeToFile("./db/db.json", result);

        res.json(`Note ${noteId} has been deleted`)
    });
});

module.exports = api;
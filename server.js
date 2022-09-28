const express = require("express");
const path = require("path");
const { readFromFile, readAndAppend, writeToFile } = require('./helpers/fsUtils');
const PORT = process.env.PORT || 3001;

const app = express();
const notes = require("./db/db.json");
const uuid = require('./helpers/uuid');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get("/", (req, res)=> {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'))
});

app.get("/api/notes", (req, res) => {
    readFromFile("./db/db.json").then((data)=> res.json(JSON.parse(data)))
});

app.post("/api/notes", (req, res) => {

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


app.delete("/api/notes/:id", (req, res) => {
    const noteId = req.params.id;
    readFromFile('./db/db.json')
    .then((data)=> JSON.parse(data))
    .then((json)=> {
        const result = json.filter((note)=> note.id !== noteId);
        writeToFile("./db/db.json", result);

        res.json(`Note ${noteId} has been deleted`)
    });
});

app.listen(PORT, ()=>
console.log(`App listening at http://localhost:${PORT}`))


const notes = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const {
    readFromFile,
    readAndAppend,
    writeToFile
} = require('../helpers/fsUtils');

//GET route - retrieves all saved notes from db.json file and returns it as JSON
notes.get('/', (req, res) => {
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

//DELETE route - receives a query parameter that contains the id of a note to delete.
notes.delete('/:id', (req, res) => {
    const noteId = req.params.id;
    readFromFile('./db/db.json')
        .then((data) => JSON.parse(data))
        .then((json) => {
            const result = json.filter((note) => note.id !== noteId);

            writeToFile('./db/db.json', result);

            res.json(`Item ${noteId} has been deleted 🗑️`);
        });
});

//POST route - receive a new note to save on the request body, add it to the db.json file, and then return the new note to the client
notes.post('/', (req, res) => {
    const { title, text } = req.body;

    if(req.body){
        const newNote = {
            title,
            text,
            id: uuidv4()
        };

        readAndAppend(newNote, './db/db.json');
        res.json('Note added successfully');
    } else {
        res.error('Error in adding note')
    }
});

module.exports = notes;
const express = require('express');
const fs = require('fs');
const path = require('path');
const db = require('./db/db.json');

const app = express();
const PORT = process.env.PORT || 3001;

//Assests
app.use(express.static('public'));

//Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//loads index page
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

//loads notes page
app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});

//get and post routes
app.route('/api/notes')
    .get((req, res) => {
        res.json(db);
    })

    .post((req, res) => {
        let newPath = path.join(__dirname, './db/db.json');
        let newNote = req.body;

        let highId = 0;

        for (let i = 0; i < db.length; i++) {
            let oneNote = db[i];

            if(oneNote.id > highId) {
                highId = oneNote.id;
            }
        }

        newNote.id = highId + 1;
        db.push(newNote);

        fs.writeFile(newPath, JSON.stringify(db), (err) => {
            if (err) {
                console.log(err);
                return;
            }
            console.log('note was saved');
        });

        res.json(newNote);
    });

//Deletes note
app.delete('/api/notes/:id', (req, res) => {
    let newPath = path.join(__dirname, '/db/db.json');

    for (i = 0; i < db.length; i++) {
        if (db[i].id == req.params.id) {
            db.splice(i, 1);
            break;
        }
    }
    fs.writeFileSync(newPath, JSON.stringify(db), (err) => {
        if (err) {
            console.log(err);
            return;
        }
    });
    res.json(db);
});

//Starts server
app.listen(PORT,  () => {
    console.log(`App listening on PORT ${PORT}`);
});
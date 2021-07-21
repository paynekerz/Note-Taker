//using final star wars and tucker solved as a reference
const path = require("path");
const fs = require("fs/promises");
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;
const dbPath = path.join(__dirname, "db/db.json");

//parses out the body of the request and gets access to req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

//HOME ROUTES
//sends html to the respective page
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname + "/public/index.html"));
  });

app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname + "/public/notes.html"));
  });

// GET NOTES
app.get("/api/notes/", async (req, res) => {
  //try block to catch errors
  try{
    const burrito = await fs.readFile(dbPath, "utf8");
    res.json(JSON.parse(burrito));
  }
  catch (err) {
    res.status(500).end("GET NOTES ERROR")
  }
})

//POST NOTES LOOK INTO THIS LATER
app.post("/api/notes/", async (req, res) => {
  //try block to catch errors
  try {
    //assigns id to new notes
    const newNote = req.body
    newNote.id = req.body.title
    const oldNotes = await fs.readFile(dbPath, "utf8");
    let parsedNotes = JSON.parse(oldNotes)
    console.log(oldNotes)
    let newNotes = [newNote, ...parsedNotes];
    fs.writeFile(dbPath, JSON.stringify(newNotes));
    console.log(newNote)
    res.json(newNotes);
  }
  catch (err){
    res.status(500).end("POST NOTES ERROR")
  }
})

//DELETE NOTES
app.delete("/api/notes/:id", async (req, res) => {
  try { 
  const deletedNote = req.params.id;
  const storedNotes = await fs.readFile(dbPath, "utf8");
  let parsedNotes = JSON.parse(storedNotes)
  let filteredNotes = parsedNotes.filter(note => deletedNote !== note.id)
  fs.writeFile(dbPath, JSON.stringify(filteredNotes));
  res.json(filteredNotes);
  }
  catch {
    res.status(500).end("DELETE NOTES ERROR")
  }
})

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);
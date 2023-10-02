
const express = require('express');
const path = require('path');
const fs = require('fs');
const dataBase = './db/db.json';
const PORT = 3001;

//make app with value of express object methods
const app = express();

//make static files in public directory available for supply 
app.use(express.static('public'));



//3001 port with no routes will go to landing page 
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public' , 'index.html') );
});


//HTML ROUTES
// http://localhost:3001/notes
//route to notes.html 
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'notes.html'));
})

//default route 


//API ROUTES 
app.get('/api/notes', (req, res) => {
    fs.readFile(dataBase, (err, data) => {
        if (err) throw err;
        let dbData = JSON.parse(data);
        res.json(dbData)
    });

})

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public' , 'index.html'));
})

//POST

app.use(express.json());

app.use(express.urlencoded({ extended: true
}));

app.post("/api/notes" , (req,res) => { 
    
    let response;
    if(req.body.text && req.body.title)   {
        response = {
            status: 'success',
            data:req.body,
        };
        res.json(`Note added`);
    } else {
    res.json(`note must have a title and text`);
}
let newNote = req.body;

console.log(newNote);
});

app.delete("/api/notes/:id", (req, res) => {
    let noteList = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    let noteId = (req.params.id).toString();

    //filter all notes that does not have matching id and saved them as a new array
    //the matching array will be deleted
    noteList = noteList.filter(selected =>{
        return selected.id != noteId;
    })

    //write the updated data to db.json and display the updated note
    fs.writeFileSync("./db/db.json", JSON.stringify(noteList));
    res.json(noteList);
});



//turn on server
app.listen(PORT, () => {
    console.log(`listening at http://localhost:${PORT}`);
});
const express = require('express');
const cors = require('cors');
const uniqid = require('uniqid');

const app = express();

app.use(cors());

const students = [
  { id: 1, firstName: 'John', lastName: 'Doe' },
  { id: 2, firstName: 'Jane', lastName: 'Doe' },
  { id: 3, firstName: 'Dave', lastName: 'Lopper' },
  { id: 4, firstName: 'Dark', lastName: 'Vador' },
  { id: 5, firstName: 'Mickey', lastName: 'Mouse' },
];

app.get('/students', (req, res) => {
  res.send(students);
});

const notes = [];

app.use(express.json());

app.post('/notes', (req, res) => {
  const { title, content } = req.body;
  const newNote = { id: uniqid(), title, content };
  notes.push(newNote);
  res.send(newNote);
});

app.get('/notes', (req, res) => {
  if (req.query.titleContains) {
    res.send(notes.filter((n) => n.title.includes(req.query.titleContains)));
  } else res.send(notes);
});

app.get('/notes/:id', (req, res) => {
  const note = notes.find((n) => n.id === req.params.id);
  if (!note) res.sendStatus(404);
  else res.send(note);
});

app.listen(5000, () => console.log('server listening on port 5000'));

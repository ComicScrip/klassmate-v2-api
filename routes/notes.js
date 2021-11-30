const express = require('express');
const Note = require('../models/note');

const notesRouter = express.Router();

notesRouter.post('/', async (req, res) => {
  const { title, content } = req.body;
  const { error: validationError } = Note.validateNote({ title, content });

  if (validationError) {
    res.status(422).json({ errors: validationError.details });
  } else {
    try {
      const id = await Note.createNote({ title, content });
      res.send({ title, content, id });
    } catch (err) {
      console.error(err);
      res.status(500).send('Cannot create that note');
    }
  }
});

notesRouter.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  const { error: validationError } = Note.validateNote(
    { title, content },
    true
  );

  if (validationError) {
    res.status(422).json({ errors: validationError.details });
  } else {
    try {
      const note = await Note.findOneNote(id);
      if (!note) res.sendStatus(404);
      await Note.updateNote(id, req.body);
      res.send({ ...note, ...req.body });
    } catch (err) {
      console.error(err);
      res.status(500).send('something went wrong while updating a note');
    }
  }
});

notesRouter.get('/', async (req, res) => {
  const search = req.query.titleOrContentContains;
  try {
    const results = await Note.findMany(search);
    res.send(results);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

notesRouter.get('/:id', async (req, res) => {
  try {
    const note = await Note.findOneNote(req.params.id);
    if (!note) res.sendStatus(404);
    else res.send(note);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

notesRouter.delete('/:id', async (req, res) => {
  const deleted = await Note.deleteNote(req.params.id);
  if (!deleted) res.sendStatus(404);
  else res.sendStatus(204);
});

module.exports = notesRouter;

const express = require('express');
const cors = require('cors');
const Joi = require('joi');

const connection = require('./db');

const app = express();

app.use(express.json());
app.use(cors());

const notesRouter = express.Router();
app.use('/notes', notesRouter);

connection.connect((err) => {
  if (err) {
    console.error(`error connecting: ${err.stack}`);
  } else {
    console.log(`connected to database with threadId : ${connection.threadId}`);
  }
});

app.get('/students/', (req, res) => {
  connection
    .promise()
    .query("SELECT firstName, lastName FROM users WHERE role='student'")
    .then(([students]) => {
      res.send(students);
    });
});

notesRouter.post('/', (req, res) => {
  const { title, content } = req.body;
  const { error: validationError } = Joi.object({
    title: Joi.string().max(255).required(),
    content: Joi.string().max(65535).required(),
  }).validate({ title, content }, { abortEarly: false });

  if (validationError) {
    res.status(422).json({ errors: validationError.details });
  } else {
    connection
      .promise()
      .query('INSERT INTO notes (title,content) VALUES (?,?)', [title, content])
      .then(([result]) => {
        res.send({ title, content, id: result.insertId });
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('aïe caremba ça marche pas ton truc');
      });
  }
});

notesRouter.get('/', (req, res) => {
  const searchInTitle = req.query.titleContains;
  connection
    .promise()
    .query(`SELECT * FROM notes ${searchInTitle ? 'WHERE title LIKE ?' : ''}`, [
      `%${searchInTitle}%`,
    ])
    .then(([results]) => {
      res.send(results);
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
});

notesRouter.get('/:id', (req, res) => {
  connection
    .promise()
    .query('SELECT * from notes WHERE id = ?', [req.params.id])
    .then(([[note]]) => {
      if (!note) res.sendStatus(404);
      else res.send(note);
    });
});

const { PORT } = process.env;

app.listen(PORT, () => console.log(`server listening on port ${PORT}`));

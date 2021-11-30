const Joi = require('joi');
const connection = require('../db');

module.exports.findMany = (search) => {
  return connection
    .promise()
    .query(
      `SELECT * FROM notes ${
        search ? 'WHERE title LIKE ? OR content LIKE ?' : ''
      }`,
      [`%${search}%`, `%${search}%`]
    )
    .then(([res]) => res);
};

module.exports.validateNote = (note, forUpdate = false) => {
  return Joi.object({
    title: Joi.string()
      .max(255)
      .presence(forUpdate ? 'optional' : 'required'),
    content: Joi.string()
      .max(65535)
      .presence(forUpdate ? 'optional' : 'required'),
  }).validate(note, { abortEarly: false });
};

module.exports.createNote = ({ title, content }) => {
  return connection
    .promise()
    .query('INSERT INTO notes (title,content) VALUES (?,?)', [title, content])
    .then(([res]) => res.insertId);
};

module.exports.findOneNote = (id) => {
  return connection
    .promise()
    .query('SELECT id, title, content FROM notes WHERE id = ?', [id])
    .then(([[res]]) => res);
};

module.exports.updateNote = (id, newAttributes) => {
  return connection
    .promise()
    .query('UPDATE notes SET ? WHERE id = ?', [{ ...newAttributes }, id]);
};

module.exports.deleteNote = (id) => {
  return connection
    .promise()
    .query('DELETE FROM notes WHERE id = ?', [id])
    .then(([res]) => !!res.affectedRows);
};

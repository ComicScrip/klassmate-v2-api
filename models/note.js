const Joi = require('joi');
const db = require('../db');

module.exports.findMany = (search = '') => {
  /* with MySQL2
  return connection
    .promise()
    .query(
      `SELECT * FROM notes ${
        search ? 'WHERE title LIKE ? OR content LIKE ?' : ''
      }`,
      [`%${search}%`, `%${search}%`]
    )
    .then(([res]) => res);
  */
  /* with Prisma + raw SQL: 
  const q = `%${search}%`;
  return db.$queryRaw`SELECT * FROM note WHERE title LIKE ${q} OR content LIKE ${q}`;
  */

  // with Prisma client API

  return db.note.findMany({
    where: {
      OR: [{ title: { contains: search } }, { content: { contains: search } }],
    },
  });
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

module.exports.createNote = async ({ title, content }) => {
  /* with MySQL2
  return db
    .promise()
    .query('INSERT INTO notes (title,content) VALUES (?,?)', [title, content])
    .then(([res]) => res.insertId);
  */

  /* with Prisma + raw SQL: 
  await db.$executeRaw`INSERT INTO note (title,content) VALUES (${title}, ${content})`;
  const [result] = await db.$queryRaw`SELECT LAST_INSERT_ID() AS id`;
  return result.id;
  */

  // with Prisma client API
  return db.note.create({ data: { title, content } }).then((note) => note.id);
};

module.exports.findOneNote = async (id) => {
  /* with MySQL2 :
  return connection
    .promise()
    .query('SELECT id, title, content FROM notes WHERE id = ?', [id])
    .then(([[res]]) => res);
  */
  /* with Prisma + raw SQL: 
  const rows =
    await db.$queryRaw`SELECT id, title, content FROM note WHERE id = ${id}`;
  return rows[0];
  */
  // with Prisma client API
  return db.note.findUnique({ where: { id: parseInt(id, 10) } });
};

module.exports.updateNote = (id, { title, content }) => {
  /* with MySQL2 :
  return connection
    .promise()
    .query('UPDATE notes SET ? WHERE id = ?', [{ ...newAttributes }, id]);
  */
  /* with Prisma + raw SQL: 
  return db.$executeRaw`UPDATE note SET content=${content} WHERE id = ${id}`;
  */

  return db.note.update({
    where: { id: parseInt(id, 10) },
    data: { title, content },
  });
};

module.exports.deleteNote = async (id) => {
  /* with MySQL2 :
  return connection
    .promise()
    .query('DELETE FROM notes WHERE id = ?', [id])
    .then(([res]) => !!res.affectedRows);
  */
  /* with Prisma + raw SQL: 
  return db.$executeRaw`DELETE FROM note WHERE id = ${id}`;
  */
  try {
    await db.note.delete({ where: { id: parseInt(id, 10) } });
    return true;
  } catch (err) {
    return false;
  }
};

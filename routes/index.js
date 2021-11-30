const studentsRouter = require('./students');
const notesRouter = require('./notes');

const setupRoutes = (app) => {
  app.use('/students', studentsRouter);
  app.use('/notes', notesRouter);
};

module.exports = {
  setupRoutes,
};

const express = require('express');
const User = require('../models/user');

const studentsRouter = express.Router();

studentsRouter.get('/', async (req, res) => {
  const students = await User.getStudents();
  res.send(students);
});

module.exports = studentsRouter;

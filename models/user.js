const connection = require('../db');

module.exports.getStudents = () => {
  return connection
    .promise()
    .query("SELECT firstName, lastName, id FROM users WHERE role='student'")
    .then(([res]) => res);
};

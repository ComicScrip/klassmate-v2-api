const db = require('../db');

module.exports.getStudents = () => {
  return db.user.findMany({ where: { role: 'student' } });
};

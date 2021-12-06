const db = require('../db');

module.exports = async function seed() {
  await db.user.createMany({
    data: [
      { firstName: 'John', lastName: 'Doe' },
      { firstName: 'Jane', lastName: 'Doe' },
      { firstName: 'Dave', lastName: 'Lopper' },
      { firstName: 'Luke', lastName: 'Skywalker' },
      { firstName: 'Ken', lastName: 'Adams' },
    ],
  });
};

module
  .exports()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });

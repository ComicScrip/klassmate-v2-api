const express = require('express');

const app = express();

const items = [
  { id: 1, firstName: 'John', lastName: 'Doe' },
  { id: 2, firstName: 'Jane', lastName: 'Doe' },
  { id: 3, firstName: 'Dave', lastName: 'Lopper' },
  { id: 4, firstName: 'Dark', lastName: 'Vador' },
  { id: 5, firstName: 'Mickey', lastName: 'Mouse' },
];

app.get('/students', (req, res) => {
  res.send(items);
});

app.listen(5000, () => console.log('server listening on port 5000'));

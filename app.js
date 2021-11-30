const express = require('express');
const cors = require('cors');

const { setupRoutes } = require('./routes/index');

const app = express();

app.use(express.json());
app.use(cors());

setupRoutes(app);

const { PORT } = process.env;

app.listen(PORT, () => console.log(`server listening on port ${PORT}`));

const express = require('express');

const app = express();

const tasks = require('./routes/tasks');
const users = require('./routes/users');

app.use(express.json());

app.use('/tasks', tasks);
app.use('/users', users);

app.listen(8000, () => console.log("Server is running on port 8000"));
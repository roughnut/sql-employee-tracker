// get express server
const express = require('express');
// db connection module
const pool = require('../config/connection');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());

pool.connect();

const server = app.listen(PORT, () => {
  console.log(`Running on ${PORT}`);
});

module.exports = new Promise((resolve) => {
  server.on('listening', resolve);
})
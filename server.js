const express = require('express');
const path = require('path');
require('dotenv').config({
  path: `${process.cwd()}/.env.production`
});
const port = process.env.PORT || 3000;
const app = express();

app.use(express.static(path.resolve(__dirname, 'build')));
app.get('*', (req, res) => {
  console.log("------------------", __dirname);
  res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
});

app.listen(port);


console.log(`Server Started on port ${port}`);

const express = require("express");

const apiRouter = require("./apiRoutes");
const htmlRouter = require("./htmlRoutes");

const app = express();

app.use('/', htmlRouter);
app.use('/api', apiRouter);

module.exports = app;
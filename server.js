const config = require("./config/env-settings.json");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const logger = require('./app/helper/logger');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use(require("./app/routes"));

app.use('*', (req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
      success: false,
      message: error.message,
      result: error.result
  })
})

app.listen(config.node_port, () => {
  logger.info(`Server listening ${config.node_port} port...`);
});

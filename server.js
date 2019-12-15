const config = require("./config/env-settings.json");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const logger = require('./app/helper/logger')

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use((req, res, next) => {
  logger.error(`\n\nServer listening ${config.node_port} port...\n\n`);
  req.logger = logger;
  next();
});

app.use(require("./app/routes"));

app.use('*', (req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  })
});

app.listen(config.node_port, () => {
  logger.info(`\n\nServer listening ${config.node_port} port...\n\n`);
});

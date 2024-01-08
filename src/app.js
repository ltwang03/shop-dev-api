require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const bodyParser = require('body-parser');
const app = express();
// init middleware
app.use(morgan('dev'));
app.use(helmet());
app.use(compression());
app.use(bodyParser.json());
// init database
require('./dbs/init.mongodb');
// init routes
app.use('/', require('./routes/index'));

//handle error
app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  return res.status(statusCode).json({
    status: 'error',
    code: statusCode,
    message: err.message || 'Internal Server Error',
  });
});

module.exports = app;

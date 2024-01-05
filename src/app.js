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

module.exports = app;

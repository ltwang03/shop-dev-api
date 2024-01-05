'use strict';
const mongoose = require('mongoose');
const {
  db: { host, name, port },
} = require('../configs/config.mongodb');
const connectionString = `mongodb://${host}:${port}/${name}`;

class Database {
  constructor() {
    this._connect();
  }
  _connect(type = 'mongodb') {
    if (1 === 1) {
      mongoose.set('debug', true);
      mongoose.set('debug', { color: true });
    }
    mongoose
      .connect(connectionString, { maxPoolSize: 10 })
      .then((_) => console.log('Database connected successfully'))
      .catch((err) => console.log('error connecting to database'));
  }
  static GetInstance() {
    if (!this.instance) {
      this.instance = new Database();
    }
    return this.instance;
  }
}

const instanceMongodb = Database.GetInstance();
module.exports = instanceMongodb;

module.exports = Database;

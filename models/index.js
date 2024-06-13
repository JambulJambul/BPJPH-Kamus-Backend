'use strict';

require('dotenv').config(); // Load environment variables
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const db = {};

let sequelize;

// Use environment variables for configuration
const config = {
  username: process.env[`DB_${env}_USERNAME`],
  password: process.env[`DB_${env}_PASSWORD`],
  database: process.env[`DB_${env}_NAME`],
  host: process.env[`DB_${env}_HOST`],
  dialect: "mysql"
};

// Ensure the dialect is explicitly set
if (!config.dialect) {
  throw new Error('Dialect needs to be specified in the environment variables.');
}

sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: config.dialect
});

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

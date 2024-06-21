'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Entry extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Entry.init({
    user_id: DataTypes.INTEGER,
    title: DataTypes.STRING,
    content: DataTypes.TEXT,
    references: DataTypes.TEXT,
    img: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Entry',
  });
  return Entry;
};
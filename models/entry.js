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
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    references: DataTypes.TEXT,
    img: DataTypes.TEXT,
    status: {
      type: DataTypes.ENUM,
      values: ['0', '1','2'],
      allowNull: false,
      defaultValue: '0',
    },
  }, {
    sequelize,
    modelName: 'Entry',
  });
  return Entry;
};
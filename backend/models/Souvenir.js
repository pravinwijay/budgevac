const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Souvenir = sequelize.define('Souvenir', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  recipient: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  timestamps: true
});

module.exports = Souvenir;

const DataTypes = require('sequelize');
const sequelize = require('../database');

module.exports = sequelize.define('User', {
    email: DataTypes.STRING,
    password: DataTypes.STRING
});

const DataTypes = require('sequelize');
const sequelize = require('../database');

module.exports = sequelize.define('Mensalista', {
    placa: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    tipoVeiculo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    validade: {
        type: DataTypes.DATE,
        allowNull: false
    }
});

const DataTypes = require('sequelize');
const sequelize = require('../database');

module.exports = sequelize.define('MensalistaPagamento', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    placa: {
        type: DataTypes.STRING,
        allowNull: false
    },
    tipoVeiculo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    valor: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    }
});

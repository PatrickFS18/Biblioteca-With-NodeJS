const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('biblioteca', 'root', '', {
  host: 'localhost',
  dialect: 'mysql'
});

module.exports = {
  Sequelize,   // Exportando a classe Sequelize
  sequelize   // Exportando a instância do Sequelize
};

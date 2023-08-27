const { sequelize, Sequelize } = require("../config/connection"); // Certifique-se de importar Sequelize
const usuario = require( "../models/usuario" )(sequelize, Sequelize); // Passando os parâmetros necessários

// Resto do código do controller...

exports.login = (req, res) => {






  res.render("initial-page", { layout: false });
};
const { sequelize, Sequelize } = require("../config/connection"); // Certifique-se de importar Sequelize
const usuario = require( "../models/usuario" )(sequelize, Sequelize); // Passando os parâmetros necessários

// Resto do código do controller...

exports.home = (req, res) => {

    res.render("login", { layout: false });
};
exports.login = (req, res) => {

    res.render("login", { layout: false });
};
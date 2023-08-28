const { sequelize, Sequelize } = require("../config/connection"); // Certifique-se de importar Sequelize
const livros = require("../models/livro")(sequelize, Sequelize); // Passando os parâmetros necessários

// Resto do código do controller...

exports.home = (req, res) => {
  res.render("home", { layout: false });
};


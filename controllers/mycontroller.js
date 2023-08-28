const { sequelize, Sequelize } = require("../config/connection"); // Certifique-se de importar Sequelize
const livros = require("../models/livro")(sequelize, Sequelize); // Passando os parâmetros necessários

// Resto do código do controller...

exports.home = (req, res) => {
  // se for admin vv
    res.render("home", { layout: false });
  //se nao:
  //res.render("home_user", { layout: false });
};

exports.exibirLivros = async (req, res) => {
  try {
    const livro = await livros.findAll();
    res.render('home_user', { livro });
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao carregar os livros');
  }
};

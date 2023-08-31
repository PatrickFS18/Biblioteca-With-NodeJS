const { sequelize, Sequelize } = require("../config/connection"); // Certifique-se de importar Sequelize
const usuario = require("../models/usuario")(sequelize, Sequelize); // Passando os parâmetros necessários
const livros = require("../models/livro")(sequelize, Sequelize); // Passando os parâmetros necessários

const bcrypt = require("bcrypt");

exports.home = (req, res) => {
  res.render("login");
};

exports.login = async (req, res) => {
  const { email, senha } = req.body;

  try {
    // Busque o usuário pelo email no banco de dados
    const user = await usuario.findOne({ where: { email } });

    req.session.userId = user.id;
    req.session.user = user.nome;

    if (!user || !(await bcrypt.compare(senha, user.senha))) {
      return res.render("login", { errorMessage: "Credenciais inválidas." });
    }

    // Se as credenciais estiverem corretas, redirecione para a página home

    if (user.nome == "admin") {
      res.render("home", { layout: false });
    } else {
      let livro = await livros.findAll();
      res.render("home_user", { livro });
    }
  } catch (error) {
    console.error("Erro ao processar o login:", error);
    res.render("login", { errorMessage: "Erro ao processar o login." });
  }
};

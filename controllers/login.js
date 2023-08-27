const { sequelize, Sequelize } = require("../config/connection"); // Certifique-se de importar Sequelize
const usuario = require( "../models/usuario" )(sequelize, Sequelize); // Passando os parâmetros necessários

const bcrypt = require("bcrypt");


exports.home = (req, res) => {

    res.render("login", { layout: false });
};

exports.login = async (req, res) => {
    const { email, senha } = req.body;
  
    try {
      // Busque o usuário pelo email no banco de dados
      const user = await usuario.findOne({ where: { email } });
  
      if (!user || !(await bcrypt.compare(senha, user.senha))) {
        return res.render("login", { errorMessage: "Credenciais inválidas." });
      }
  
      // Se as credenciais estiverem corretas, redirecione para a página de dashboard
      res.render("home", { layout: false });
    } catch (error) {
      console.error("Erro ao processar o login:", error);
      res.render("login", { errorMessage: "Erro ao processar o login." });
    }
  };
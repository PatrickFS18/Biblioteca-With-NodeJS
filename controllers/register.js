const { sequelize, Sequelize } = require("../config/connection"); // Certifique-se de importar Sequelize
const Usuario = require("../models/usuario")(sequelize, Sequelize); // Passando os parâmetros necessários

const bcrypt = require("bcrypt");


exports.home = (req, res) => {
    res.render("register", { layout: false });
  };

exports.register = async (req, res) => {
  try {
    // Recuperar os dados do formulário de registro
    const { nome, email, senha } = req.body;

    // Verificar se o usuário já está registrado
    const existingUser = await Usuario.findOne({ where: { email } });
    if (existingUser) {
      return res.render("register", { errorMessage: "Email já registrado." });
    }

    // Criptografar a senha antes de armazenar no banco de dados
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(senha, saltRounds);

    // Criar um novo usuário com a senha criptografada
    const newUser = await Usuario.create({
      nome,
      email,
      senha: hashedPassword, // Armazenar a senha criptografada
    });

    // Redirecionar ou renderizar a página de sucesso
    res.render("login", { user: newUser });
  } catch (error) {
    console.error("Erro ao registrar usuário:", error);
    res.render("register", { errorMessage: "Erro ao registrar usuário." });
  }
};

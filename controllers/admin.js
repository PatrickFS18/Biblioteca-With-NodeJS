const { sequelize, Sequelize } = require("../config/connection"); // Certifique-se de importar Sequelize
const livros = require("../models/livro")(sequelize, Sequelize); // Passando os parâmetros necessários
const usuario = require("../models/usuario")(sequelize, Sequelize); // Passando os parâmetros necessários
const { Op } = require('sequelize');
// Resto do código do controller...

exports.home = (req, res) => {
    res.render("administrar", { layout: false });
};

exports.adicionar_home = (req, res) => {
    res.render("adicionarLivro", { layout: false });
};
exports.administrar_home = async (req, res) => {
    try {
      const usuarios = await usuario.findAll({
        where: {
          nome: {
            [Op.ne]: 'admin' // Seleciona todos os usuários cujo papel não é 'admin'
          }
        }
      });
      const livro = await livros.findAll();
  
      res.render("administrar", { layout: false, usuarios, livro });
    } catch (error) {
      console.error(error);
      res.status(500).send('Ocorreu um erro ao carregar os dados');
    }
  };

exports.adicionar_livro = async (req, res) => {
    try {
        const { titulo, autores, ano, editora, qntdisponivel } = req.body;
        // Criação do livro no banco de dados
        await livros.create({
            titulo,
            autores,
            ano,
            editora,
            qntdisponivel
        });

        res.render("adicionarLivro");
    } catch (error) {
        console.error(error);
        res.status(500).send('Ocorreu um erro ao adicionar o livro');
    }

};


exports.excluirUsuario = async (req, res) => {
    try {
        const id = req.params.id;
        await usuario.destroy({
            where: {
                id: id
            }
        });
        res.sendStatus(200);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
};


exports.excluirLivro = async (req, res) => {
    try {
        const id = req.params.id;
        await livros.destroy({
            where: {
                id: id
            }
        });
        res.sendStatus(200);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
};
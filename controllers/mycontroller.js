const { sequelize, Sequelize } = require("../config/connection"); // Certifique-se de importar Sequelize
const livros = require("../models/livro")(sequelize, Sequelize); // Passando os parâmetros necessários
const UsuarioLivro = require("../models/usuarioLivro")(sequelize, Sequelize); // Passando os parâmetros necessários

// Resto do código do controller...

exports.home = (req, res) => {
  // se for admin vv
    res.render("home", { layout: false });
  //se nao:
  //res.render("home_user", { layout: false });
};

exports.exibirLivros = async (req, res) => {
  try {
    let livro = await livros.findAll();
    res.render('home_user', { livro });
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao carregar os livros');
  }
};



exports.alugarLivro = async (req, res) => {
  const livroId = req.params.id; 
  // Capturar o ID do livro a ser alugado
  //const usuarioId = req.session.usuarioId; 
  const usuarioId = 2; 

  try {
    const livro = await livros.findByPk(livroId);

    if (!livro) {
      return res.status(404).send('Livro não encontrado');
    }

    if (livro.qntdisponivel > 0) {
      // Atualizar as informações do livro para refletir o aluguel
      await livro.update({
        qntdisponivel: livro.qntdisponivel - 1,
      });
       // Atualizar ou criar registro no modelo UsuarioLivro
       let usuarioLivro = await UsuarioLivro.findOne({
        where: {
          usuarioId: usuarioId,
          livroId: livroId
        }
      });

      if (usuarioLivro) {
        // Se já existir um registro, incrementar a quantidade
        UsuarioLivro.quantidade += 1;
        await UsuarioLivro.save();
      } else {
        // Se não existir, criar um novo registro
        await UsuarioLivro.create({
          usuarioId: usuarioId,
          livroId: livroId,
          quantidade: 1
        });
      }
      let todosLivros = await livros.findAll();
      return res.render("home_user",{ livro:todosLivros});
    } else {
      let todosLivros = await livros.findAll();

      return res.render("home_user",{ livro:todosLivros});
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao alugar o livro');
  }
};


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
    let livro = await livros.findAll();
    res.render('home_user', { livro });
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao carregar os livros');
  }
};



exports.alugarLivro = async (req, res) => {
  const livroId = req.params.id; // Capturar o ID do livro a ser alugado
  const usuarioId = req.session.usuarioId; // Capturar o ID do usuário logado

  try {
    const livro = await livros.findByPk(livroId);

    if (!livro) {
      return res.status(404).send('Livro não encontrado');
    }

    if (livro.qntdisponivel > 0 && livro.possuidor === 'vazio') {
      // Atualizar as informações do livro para refletir o aluguel
      await livro.update({
        qntdisponivel: livro.qntdisponivel - 1,
        possuidor: usuarioId
      });
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


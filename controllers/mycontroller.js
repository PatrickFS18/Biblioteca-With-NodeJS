const { sequelize, Sequelize } = require("../config/connection"); // Certifique-se de importar Sequelize
const livros = require("../models/livro")(sequelize, Sequelize); // Passando os parâmetros necessários
const UsuarioLivro = require("../models/usuarioLivro")(sequelize, Sequelize); // Passando os parâmetros necessários
const usuario = require("../models/usuario")(sequelize, Sequelize); // Passando os parâmetros necessários
const { Op } = require("sequelize"); // Importando o operador de comparação

exports.home = (req, res) => {
  const user_id = req.session.userId;
  if (user_id == 1) {
    //admin
    res.render("home", { layout: false });
  }else{
  //user normal
  res.render("home_user", { layout: false });
}
};

exports.search = (req, res) => {
  // se for admin vv
  res.render("search", { layout: false });
};

exports.exibirLivros = async (req, res) => {
  
  
  try {
    if (!req.session.userId) {
      return res.status(401).send("Usuário não autenticado");
    }

    const usuarioId = req.session.userId;
    let username = await usuario.findOne({
      where: {
        id: usuarioId,
      },
    });
    
    // Consulta para buscar os livros associados ao usuário pelo ID
    let livrosDoUsuario = await UsuarioLivro.findAll({
      where: {
        usuarioId: usuarioId,
      },
    });

    // Criar uma matriz para armazenar os nomes dos livros
    const nomesDosLivros = [];

    // Iterar pelos resultados para buscar os nomes dos livros
    for (const livroDoUsuario of livrosDoUsuario) {
      const livrox = await livros.findOne({
        where: {
          id: livroDoUsuario.livroId,
        },
      });

      // Verificar se o livro foi encontrado
      if (livrox) {
        // Adicionar os detalhes do livro à matriz
        nomesDosLivros.push({
          titulo: livrox.titulo,
          autores: livrox.autores,
          ano: livrox.ano,
          editora: livrox.editora,
        });
      }
    }
   

    return res.render("home_user", { livro: nomesDosLivros,usern: username });

  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao carregar os livros");
  }
};

exports.alugarLivro = async (req, res) => {
  
    const livroId = req.params.id;
    const usuarioId = req.session.userId;
    let username = await usuario.findOne({
      where: {
        id: usuarioId,
      },
    });
    let livrosDoUsuario = await UsuarioLivro.findAll({
      where: {
        usuarioId: usuarioId,
      },
    });

    // Criar uma matriz para armazenar os nomes dos livros
    const nomesDosLivros = [];

    // Iterar pelos resultados para buscar os nomes dos livros
    for (const livroDoUsuario of livrosDoUsuario) {
      const livrox = await livros.findOne({
        where: {
          id: livroDoUsuario.livroId,
        },
      });

      // Verificar se o livro foi encontrado
      if (livrox) {
        // Adicionar os detalhes do livro à matriz
        nomesDosLivros.push({
          titulo: livrox.titulo,
          autores: livrox.autores,
          ano: livrox.ano,
          editora: livrox.editora,
        });
      }
    }
    const mensagem = encodeURIComponent("livro_alugado");
    const erro = encodeURIComponent("erro");
  
    try {
      const livro = await livros.findByPk(livroId);
      
      if (!livro) {
        return res.status(404).send("Livro não encontrado");
      }
  
      if (livro.qntdisponivel > 0) {
        const usuarioLivro = await UsuarioLivro.findOne({
          where: {
            usuarioId: usuarioId,
            livroId: livroId,
          },
        });
  
        if (usuarioLivro) {
          livro.qntdisponivel -= 1;
          await livro.save();
  
          usuarioLivro.quantidade += 1;
          await usuarioLivro.save();
        } else {
          livro.qntdisponivel -= 1;
          await livro.save();
  
          await UsuarioLivro.create({
            usuarioId: usuarioId,
            livroId: livroId,
            quantidade: 1,
          });
        }
  
       
  
        return res.render("home_user", { livro: nomesDosLivros, mensagem: mensagem,usern: username });
      } else {
  
        return res.render("home_user", { livro: nomesDosLivros, erro: erro ,usern: username});
      }
    } catch (error) {
      console.error(error);
      res.status(500).send("Erro ao alugar o livro");
    }
  };
  
  

//funções de busca
exports.buscarPorTitulo = async (req, res) => {
  try {
    const searchTerm = req.body.titulo.toLowerCase();
    const livrosEncontrados = await livros.findAll({
      where: sequelize.where(
        sequelize.fn("LOWER", sequelize.col("titulo")),
        "LIKE",
        `%${searchTerm}%`
      ),
    });
    res.render("search", { livrosEncontrados: livrosEncontrados });
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao buscar por título");
  }
};

exports.buscarPorAno = async (req, res) => {
  try {
    const livrosOrdenadosPorAno = await livros.findAll({
      order: [["ano", "DESC"]],
    });
    res.render("search", { livrosOrdenadosPorAno: livrosOrdenadosPorAno });
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao buscar por ano");
  }
};


exports.editarLivro = async (req, res) => {
  
  try {
    const livroId = req.params.id;
    const livro = await livros.findOne({
      where: {
        id: livroId,
      },
    });
    res.render("editarLivro",{livro:livro});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ocorreu um erro ao editar o livro.' });
  }
};

exports.editar = async (req, res) => {
  try {
    const { livroId,titulo, autores, ano, editora, qntdisponivel } = req.body; 

    const livroExistente = await livros.findOne({
      where: {
        id: livroId,
      },
    });

    if (!livroExistente) {
      return res.status(404).json({ error: 'Livro não encontrado.' });
    }

    livroExistente.titulo = titulo;
    livroExistente.autores = autores;
    livroExistente.ano = ano;
    livroExistente.editora = editora;
    livroExistente.qntdisponivel = qntdisponivel;

    await livroExistente.save();

    return res.redirect('/administrar');
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Ocorreu um erro ao editar o livro.' });
  }
};
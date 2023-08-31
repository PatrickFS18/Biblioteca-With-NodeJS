const { sequelize, Sequelize } = require("../config/connection"); // Certifique-se de importar Sequelize
const livros = require("../models/livro")(sequelize, Sequelize); // Passando os parâmetros necessários
const UsuarioLivro = require("../models/usuarioLivro")(sequelize, Sequelize); // Passando os parâmetros necessários
const { Op } = require("sequelize"); // Importando o operador de comparação
// Resto do código do controller...

exports.home = (req, res) => {
    // se for admin vv
    res.render("home", { layout: false });
    //se nao:
    //res.render("home_user", { layout: false });
};

exports.search = (req, res) => {
    // se for admin vv
    res.render("search", { layout: false });
};


exports.exibirLivros = async(req, res) => {
    try {
        let livro = await livros.findAll();
        res.render("home_user", { livro });
      
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro ao carregar os livros");
    }
};

exports.alugarLivro = (req, res) => {
    const livroId = req.params.id;
    // Capturar o ID do livro a ser alugado
    //const usuarioId = req.session.usuarioId;
    const usuarioId = 2;
    const mensagem = encodeURIComponent('livro_alugado');
    const erro = encodeURIComponent('erro');

    livros
        .findByPk(livroId)
        .then((livro) => {
            if (!livro) {
                return res.status(404).send("Livro não encontrado");
            }

            if (livro.qntdisponivel > 0) {
                UsuarioLivro.findOne({
                    where: {
                        usuarioId: usuarioId,
                        livroId: livroId,
                    },
                }).then((usuarioLivro) => {
                    if (usuarioLivro) {
                        livro.update({
                            qntdisponivel: livro.qntdisponivel - 1,
                        });

                        usuarioLivro.quantidade += 1;
                        
                        usuarioLivro.save().then(() => {
                            livros.findAll().then((todosLivros) => {
                                return res.render("home_user", { livro: todosLivros,mensagem:mensagem });
                            });
                        });
                    } else {
                        livro.update({
                            qntdisponivel: livro.qntdisponivel - 1,
                        });

                        UsuarioLivro.create({
                            usuarioId: usuarioId,
                            livroId: livroId,
                            quantidade: 1,
                        }).then(() => {
                            livros.findAll().then((todosLivros) => {
                                return res.render("home_user", { livro: todosLivros,mensagem:mensagem });
                            });
                        });
                    }
                });
            } else {
                livros.findAll().then((todosLivros) => {
                    return res.render("home_user", { livro: todosLivros,erro:erro });
                });
            }
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send("Erro ao alugar o livro");
        });
};

//funções de busca
exports.buscarPorTitulo = async(req, res) => {
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

exports.buscarPorAno = async(req, res) => {
    try {
        const livrosOrdenadosPorAno = await livros.findAll({
            order: [
                ["ano", "DESC"]
            ],
        });
        res.render("search", { livrosOrdenadosPorAno: livrosOrdenadosPorAno });
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro ao buscar por ano");
    }
};
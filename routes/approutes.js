// routes/routes.js
const express = require('express');
const router = express.Router();

const myController = require("../controllers/mycontroller");
const login = require("../controllers/login");
const register = require("../controllers/register");
const admin = require("../controllers/admin");

router.get("/search", myController.search);

router.get("/", login.home); // "/" é login
router.get("/register", register.home); // "/register" é registro
router.get("/login", myController.exibirLivros); // "/login" é logado
router.get("/admin", admin.home); // "/login" é logado
router.get('/editarLivro/:id', myController.editarLivro);

router.get("/adicionar_livro", admin.adicionar_home);
router.get("/administrar", admin.administrar_home);

router.post("/login", login.login);
router.post("/register", register.register);

router.post("/ordenar", myController.buscarPorAno);
router.post("/buscar", myController.buscarPorTitulo);

router.post("/adicionar_livro", admin.adicionar_livro);
router.post('/alugar_livro/:id', myController.alugarLivro);


router.delete('/excluir_usuario/:id', admin.excluirUsuario);
router.delete('/excluir_livro/:id', admin.excluirLivro);
router.post('/editarLivro', myController.editar);



module.exports = router;
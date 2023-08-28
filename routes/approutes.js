// routes/routes.js
const express = require('express');
const router = express.Router();

const myController = require("../controllers/mycontroller");
const login = require("../controllers/login");
const register = require("../controllers/register");
const admin = require("../controllers/admin");

router.get("/", login.home); // "/" é login
 router.get("/register", register.home); // "/register" é registro
router.get("/home",myController.exibirLivros); // "/home" é logado

router.get("/adicionar_livro", admin.adicionar_home);
router.get("/administrar", admin.administrar_home);

router.post("/home",login.login);
router.post("/register",register.register);

router.post("/adicionar_livro", admin.adicionar_livro);


router.delete('/excluir_usuario/:id', admin.excluirUsuario);
router.delete('/excluir_livro/:id', admin.excluirLivro);

module.exports = router;

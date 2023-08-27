// routes/routes.js
const express = require('express');
const router = express.Router();
const myController = require("../controllers/mycontroller");
const login = require("../controllers/login");
const register = require("../controllers/register");

router.get("/",myController.home);
router.get("/register",register.home);

router.post("/login",login.login);


module.exports = router;

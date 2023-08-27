// routes/routes.js
const express = require('express');
const router = express.Router();
const myController = require("../controllers/mycontroller");

router.get("/",myController.home);


module.exports = router;

"use strict";

var express = require("express");
var UserController = require("../controllers/user");
var md_auth = require('../middlewares/authetication')
var api = express.Router();

api.post("/register", UserController.saveUser);
api.post("/login", UserController.login);
api.get("/me", md_auth.ensureAuth, UserController.getUser);
api.get('/users/:page?', md_auth.ensureAuth, UserController.getUsers);
//api.put("/user/", md_auth.ensureAuth, UserController.updateUser);

module.exports = api;


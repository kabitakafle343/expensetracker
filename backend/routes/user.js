const express = require("express");
const route = express.Router();

const { userLogin, UserSignUp } = require("../controller/user");

route.post("/signup", UserSignUp);
route.post("/signin", userLogin);
module.exports = route;

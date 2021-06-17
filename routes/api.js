var express = require("express");
var authRouter = require("./auth");
var bookRouter = require("./book");
var pedidoRouter = require("./pedido");

var app = express();

app.use("/auth/", authRouter);
app.use("/book/", bookRouter);
app.use("/pedido/", pedidoRouter);

module.exports = app;
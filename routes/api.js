var express = require("express");
var authRouter = require("./auth");
var pedidoRouter = require("./pedido");
var pratoRouter = require("./prato");

var app = express();

app.use("/auth/", authRouter);
app.use("/pedido/", pedidoRouter);
app.use("/prato/", pratoRouter);

module.exports = app;
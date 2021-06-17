var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var PedidoSchema = new Schema({
	mesa: {type: String, required: true},
	status: {type: String, required: true},
	nomeCliente: {type: String, required: true},
	valor: {type: String, required: true},
	user: { type: Schema.ObjectId, ref: "User", required: true },
}, {timestamps: true});

module.exports = mongoose.model("Pedido", PedidoSchema);
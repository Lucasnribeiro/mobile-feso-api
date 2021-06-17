var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var PratoSchema = new Schema({
	nome: {type: String, required: true},
    pedido_id: {type: String, required: true},
	quantidade: {type: String, required: true},
	preco_unitario: {type: String, required: true},
	user: { type: Schema.ObjectId, ref: "User", required: true },
}, {timestamps: true});

module.exports = mongoose.model("Prato", PratoSchema);
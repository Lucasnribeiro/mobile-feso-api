const Pedido = require("../models/PedidoModel");
const { body,validationResult } = require("express-validator");
const { sanitizeBody } = require("express-validator");
const apiResponse = require("../helpers/apiResponse");
const auth = require("../middlewares/jwt");
var mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);

// Pedido Schema
function PedidoData(data) {
	this.id = data._id;
	this.mesa= data.title;
	this.status = data.description;
	this.valor = data.description;
	this.createdAt = data.createdAt;
}

/**
 * Pedido List.
 * 
 * @returns {Object}
 */
exports.pedidoList = [
	auth,
	function (req, res) {
		try {
			Pedido.find({user: req.user._id},"_id mesa nomeCliente status valor createdAt").then((pedidos)=>{
				if(pedidos.length > 0){
					return apiResponse.successResponseWithData(res, "Operation success", pedidos);
				}else{
					return apiResponse.successResponseWithData(res, "Operation success", []);
				}
			});
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];

/**
 * Pedido Detail.
 * 
 * @param {string}      id
 * 
 * @returns {Object}
 */
exports.pedidoDetail = [
	auth,
	function (req, res) {
		if(!mongoose.Types.ObjectId.isValid(req.params.id)){
			return apiResponse.successResponseWithData(res, "Operation success", {});
		}
		try {
			Pedido.findOne({_id: req.params.id,user: req.user._id},"_id mesa nomeCliente status valor createdAt").then((pedido)=>{                
				if(pedido !== null){
					let pedidoData = new PedidoData(pedido);
					return apiResponse.successResponseWithData(res, "Operation success", pedidoData);
				}else{
					return apiResponse.successResponseWithData(res, "Operation success", {});
				}
			});
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];

/**
 * Pedido store.
 * 
 * @param {string}      mesa 
 * @param {string}      status
 * @param {string}      valor
 * @param {string}      nomeCliente
 * 
 * @returns {Object}
 */
exports.pedidoStore = [
	auth,
	body("mesa", "Mesa must not be empty.").isLength({ min: 1 }).trim(),
	body("nomeCliente", "nomeCliente must not be empty.").isLength({ min: 1 }).trim(),
	sanitizeBody("*").escape(),
	(req, res) => {
		try {
			const errors = validationResult(req);
			var pedido = new Pedido(
				{ 	mesa: req.body.mesa,
					nomeCliente: req.body.nomeCliente,
					user: req.user,
					status: "1", 
					valor: "0"
				});

			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}
			else {
				//Save pedido.
				pedido.save(function (err) {
					if (err) { return apiResponse.ErrorResponse(res, err); }
					let pedidoData = new PedidoData(pedido);
					return apiResponse.successResponseWithData(res,"Pedido add Success.", pedidoData);
				});
			}
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];

/**
 * Pedido update.
 * 
 * @param {string}      id
 * @param {string}      mesa 
 * @param {string}      status
 * @param {string}      valor
 * 
 * @returns {Object}
 */
exports.pedidoUpdate = [
	auth,
	body("mesa", "Mesa must not be empty.").isLength({ min: 1 }).trim(),
	body("status", "Status must not be empty.").isLength({ min: 1 }).trim(),
	sanitizeBody("*").escape(),
	(req, res) => {
		try {
			const errors = validationResult(req);
			var pedido = new Pedido(
				{ 	mesa: req.body.mesa,
					user: req.user,
					status: req.body.status, 
					valor: req.body.valor,
					nomeCliente: req.body.nomeCliente
				});

			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}
			else {
				if(!mongoose.Types.ObjectId.isValid(req.params.id)){
					return apiResponse.validationErrorWithData(res, "Invalid Error.", "Invalid ID");
				}else{
					Pedido.findById(req.params.id, function (err, foundPedido) {
						if(foundPedido === null){
							return apiResponse.notFoundResponse(res,"Pedido not exists with this id");
						}else{
							//Check authorized user
							if(foundPedido.user.toString() !== req.user._id){
								return apiResponse.unauthorizedResponse(res, "You are not authorized to do this operation.");
							}else{
								//update pedido.
								Pedido.findByIdAndUpdate(req.params.id, pedido, {},function (err) {
									if (err) { 
										return apiResponse.ErrorResponse(res, err); 
									}else{
										let pedidoData = new PedidoData(pedido);
										return apiResponse.successResponseWithData(res,"Pedido update Success.", pedidoData);
									}
								});
							}
						}
					});
				}
			}
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];

/**
 * Pedido Delete.
 * 
 * @param {string}      id
 * 
 * @returns {Object}
 */
exports.pedidoDelete = [
	auth,
	function (req, res) {
		if(!mongoose.Types.ObjectId.isValid(req.params.id)){
			return apiResponse.validationErrorWithData(res, "Invalid Error.", "Invalid ID");
		}
		try {
			Pedido.findById(req.params.id, function (err, foundPedido) {
				if(foundPedido === null){
					return apiResponse.notFoundResponse(res,"Pedido don't exists with this id");
				}else{
					//Check authorized user
					if(foundPedido.user.toString() !== req.user._id){
						return apiResponse.unauthorizedResponse(res, "You are not authorized to do this operation.");
					}else{
						//delete book.
						Pedido.findByIdAndRemove(req.params.id,function (err) {
							if (err) { 
								return apiResponse.ErrorResponse(res, err); 
							}else{
								return apiResponse.successResponse(res,"Pedido delete Success.");
							}
						});
					}
				}
			});
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];
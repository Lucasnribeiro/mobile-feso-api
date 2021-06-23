const Prato = require("../models/PratoModel");
const { body,validationResult } = require("express-validator");
const { sanitizeBody } = require("express-validator");
const apiResponse = require("../helpers/apiResponse");
const auth = require("../middlewares/jwt");
var mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);

// Prato Schema
function PratoData(data) {
	this.id = data._id;
	this.nome= data.nome;
	this.quantidade = data.quantidade;
	this.pedido_id = data.pedido_id;
	this.preco_unitario = data.preco_unitario;
	this.createdAt = data.createdAt;
}

/**
 * Prato List.
 * 
 * @returns {Object}
 */
exports.pratoList = [
	auth,
	function (req, res) {
		try {
			Prato.find({user: req.user._id},"_id nome quantidade pedido_id preco_unitario createdAt").then((prato)=>{
				if(prato.length > 0){
					return apiResponse.successResponseWithData(res, "Operation success", prato);
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
 * Prato Detail.
 * 
 * @param {string}      id
 * 
 * @returns {Object}
 */
exports.pratoDetail = [
	auth,
	function (req, res) {
		if(!mongoose.Types.ObjectId.isValid(req.params.id)){
			return apiResponse.successResponseWithData(res, "Operation success", {});
		}
		try {
			Prato.findOne({_id: req.params.id,user: req.user._id},"_id nome quantidade pedido_id preco_unitario createdAt").then((prato)=>{                
				if(prato !== null){
					let pratoData = new PratoData(prato);
					return apiResponse.successResponseWithData(res, "Operation success", pratoData);
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
 * Prato by Pedido.
 * 
 * @param {string}      id
 * 
 * @returns {Object}
 */
 exports.pratoByPedido = [
	auth,
	function (req, res) {
		if(!mongoose.Types.ObjectId.isValid(req.params.id)){
			return apiResponse.successResponseWithData(res, "Operation success", {});
		}
		try {
			Prato.find({pedido_id: req.params.id},"_id nome quantidade pedido_id preco_unitario createdAt").then((prato)=>{                
				if(prato.length > 0){
					return apiResponse.successResponseWithData(res, "Operation success", prato);
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
 * Pedido store.
 * 
 * @param {string}      nome
 * @param {string}      pedido_id
 * @param {string}      quantidade
 * @param {string}      preco_unitario
 * 
 * @returns {Object}
 */

 exports.pratoStore = [
	auth,
	body("nome", "Nome must not be empty.").isLength({ min: 1 }).trim(),
	body("preco_unitario", "Preco_unitario must not be empty.").isLength({ min: 1 }).trim(),
	body("quantidade", "Quantidade must not be empty.").isLength({ min: 1 }).trim(),
	body("pedido_id", "Pedido_id must not be empty.").isLength({ min: 1 }).trim(),
	sanitizeBody("*").escape(),
	(req, res) => {
		try {
			const errors = validationResult(req);
			var prato = new Prato(
				{ 	nome: req.body.nome,
					pedido_id: req.body.pedido_id,
					quantidade: req.body.quantidade,
					preco_unitario: req.body.preco_unitario,
					user: req.user,
				});

			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}
			else {
				//Save prato.
				prato.save(function (err) {
					if (err) { return apiResponse.ErrorResponse(res, err); }
					let pratoData = new PratoData(prato);
					return apiResponse.successResponseWithData(res,"Prato add Success.", pratoData);
				});
			}
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];

/**
 * Prato update.
 * 
 * @param {string}      id
 * @param {string}      nome 
 * @param {string}      pedido_id
 * @param {string}      quantidade
 * @param {string}      preco_unitario
 * 
 * @returns {Object}
 */

 exports.pratoUpdate = [
	auth,
	body("id", "id must not be empty.").isLength({ min: 1 }).trim(),
	sanitizeBody("*").escape(),
	(req, res) => {
		try {
			const errors = validationResult(req);
			var prato = new Prato(
				{ 	nomePrato: req.body.nomePrato,
					valorPrato: req.body.valorPrato
				});

			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}
			else {
				if(!mongoose.Types.ObjectId.isValid(req.params.id)){
					return apiResponse.validationErrorWithData(res, "Invalid Error.", "Invalid ID");
				}else{
					Pedido.findById(req.params.id, function (err, foundPrato) {
						if(foundPrato === null){
							return apiResponse.notFoundResponse(res,"Prato not exists with this id");
						}else{
							//Check authorized user
							if(foundPrato.user.toString() !== req.user._id){
								return apiResponse.unauthorizedResponse(res, "You are not authorized to do this operation.");
							}else{
								//update prato.
								Prato.findByIdAndUpdate(req.params.id, prato, {},function (err) {
									if (err) { 
										return apiResponse.ErrorResponse(res, err); 
									}else{
										let pratoData = new PratoData(prato);
										return apiResponse.successResponseWithData(res,"Prato update Success.", pratoData);
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
 * Prato Delete.
 * 
 * @param {string}      id
 * 
 * @returns {Object}
 */
 exports.pratoDelete = [
	auth,
	function (req, res) {
		if(!mongoose.Types.ObjectId.isValid(req.params.id)){
			return apiResponse.validationErrorWithData(res, "Invalid Error.", "Invalid ID");
		}
		try {
			Prato.findById(req.params.id, function (err, foundPrato) {
				if(foundPedido === null){
					return apiResponse.notFoundResponse(res,"Prato don't exists with this id");
				}else{
					//Check authorized user
					if(foundPrato.user.toString() !== req.user._id){
						return apiResponse.unauthorizedResponse(res, "You are not authorized to do this operation.");
					}else{
						//delete book.
						Prato.findByIdAndRemove(req.params.id,function (err) {
							if (err) { 
								return apiResponse.ErrorResponse(res, err); 
							}else{
								return apiResponse.successResponse(res,"Prato delete Success.");
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



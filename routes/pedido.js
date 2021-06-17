var express = require("express");
const PedidoController = require("../controllers/PedidoController");

var router = express.Router();

router.get("/", PedidoController.pedidoList);
router.get("/:id", PedidoController.pedidoDetail);
router.post("/", PedidoController.pedidoStore);
router.put("/:id", PedidoController.pedidoUpdate);
router.delete("/:id", PedidoController.pedidoDelete);

module.exports = router;
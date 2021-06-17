var express = require("express");
const PratoController = require("../controllers/PratoController");

var router = express.Router();

router.get("/", PratoController.pratoList);
router.get("/:id", PratoController.pratoDetail);
router.post("/", PratoController.pratoStore);
router.put("/:id", PratoController.pratoUpdate);
router.delete("/:id", PratoController.pratoDelete);

module.exports = router;
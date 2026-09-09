const express = require("express");
const router = express.Router();

const servicoController = require("../controllers/servicoController");

router.get("/", servicoController.listar);
router.post("/", servicoController.cadastrar);
router.put("/:id", servicoController.atualizar);
router.delete("/:id", servicoController.excluir);

module.exports = router;
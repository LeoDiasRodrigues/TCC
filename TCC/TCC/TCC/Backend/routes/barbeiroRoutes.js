const express = require("express");
const router = express.Router();

const barbeiroController = require("../controllers/barbeiroController");

router.get("/", barbeiroController.listar);
router.post("/", barbeiroController.cadastrar);
router.put("/:id", barbeiroController.atualizar);
router.delete("/:id", barbeiroController.excluir);

module.exports = router;
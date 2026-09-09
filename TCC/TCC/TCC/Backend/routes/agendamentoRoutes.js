const express = require("express");
const router = express.Router();

const agendamentoController = require("../controllers/agendamentoController");

router.get("/", agendamentoController.listar);
router.post("/", agendamentoController.cadastrar);
router.put("/:id", agendamentoController.atualizar);
router.delete("/:id", agendamentoController.excluir);

module.exports = router;
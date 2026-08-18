const Barbeiro = require("../models/barbeiroModel");

// Listar todos
exports.listar = async (req, res) => {
    try {
        const barbeiros = await Barbeiro.find();
        res.json(barbeiros);
    } catch (erro) {
        res.status(500).json({ mensagem: "Erro ao buscar barbeiros.", erro: erro.message });
    }
};

// Cadastrar
exports.cadastrar = async (req, res) => {
    try {
        const { nome, especialidade, telefone } = req.body;

        // Validação dos campos obrigatórios
        if (!nome || !especialidade || !telefone) {
            return res.status(400).json({ mensagem: "Todos os campos são obrigatórios." });
        }

        const novoBarbeiro = await Barbeiro.create({
            nome,
            especialidade,
            telefone
        });

        res.status(201).json(novoBarbeiro);
    } catch (erro) {
        res.status(500).json({ mensagem: "Erro ao cadastrar barbeiro.", erro: erro.message });
    }
};

// Atualizar
exports.atualizar = async (req, res) => {
    try {
        const barbeiroAtualizado = await Barbeiro.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true } // Retorna o registro atualizado
        );

        if (!barbeiroAtualizado) {
            return res.status(404).json({ mensagem: "Barbeiro não encontrado." });
        }

        res.json(barbeiroAtualizado);
    } catch (erro) {
        res.status(500).json({ mensagem: "Erro ao atualizar barbeiro.", erro: erro.message });
    }
};

// Excluir
exports.excluir = async (req, res) => {
    try {
        const barbeiroExcluido = await Barbeiro.findByIdAndDelete(req.params.id);

        if (!barbeiroExcluido) {
            return res.status(404).json({ mensagem: "Barbeiro não encontrado." });
        }

        res.json({ mensagem: "Barbeiro excluído com sucesso." });
    } catch (erro) {
        res.status(500).json({ mensagem: "Erro ao excluir barbeiro.", erro: erro.message });
    }
};
const Servico = require("../models/servicoModel");

// Listar todos
exports.listar = async (req, res) => {
    try {
        const servicos = await Servico.find();
        res.json(servicos);
    } catch (erro) {
        res.status(500).json({ mensagem: "Erro ao buscar serviços.", erro: erro.message });
    }
};

// Cadastrar
exports.cadastrar = async (req, res) => {
    try {
        const { nome, preco } = req.body;

        if (!nome || !preco) {
            return res.status(400).json({ mensagem: "Nome e preço são obrigatórios." });
        }

        const novoServico = await Servico.create({
            nome,
            preco: Number(preco)
        });

        res.status(201).json(novoServico);
    } catch (erro) {
        res.status(500).json({ mensagem: "Erro ao cadastrar serviço.", erro: erro.message });
    }
};

// Atualizar
exports.atualizar = async (req, res) => {
    try {
        const { nome, preco } = req.body;

        const servicoAtualizado = await Servico.findByIdAndUpdate(
            req.params.id,
            { nome, preco: Number(preco) },
            { new: true } // Retorna o registro já atualizado
        );

        if (!servicoAtualizado) {
            return res.status(404).json({ mensagem: "Serviço não encontrado." });
        }

        res.json(servicoAtualizado);
    } catch (erro) {
        res.status(500).json({ mensagem: "Erro ao atualizar serviço.", erro: erro.message });
    }
};

// Excluir
exports.excluir = async (req, res) => {
    try {
        const servicoExcluido = await Servico.findByIdAndDelete(req.params.id);

        if (!servicoExcluido) {
            return res.status(404).json({ mensagem: "Serviço não encontrado." });
        }

        res.json({ mensagem: "Serviço excluído com sucesso." });
    } catch (erro) {
        res.status(500).json({ mensagem: "Erro ao excluir serviço.", erro: erro.message });
    }
};
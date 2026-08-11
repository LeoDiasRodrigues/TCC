const Cliente = require("../models/clienteModel");

// Listar todos
exports.listar = async (req, res) => {
    try {
        const clientes = await Cliente.find();
        res.json(clientes);
    } catch (erro) {
        res.status(500).json({ mensagem: "Erro ao buscar clientes.", erro: erro.message });
    }
};

// Cadastrar
exports.cadastrar = async (req, res) => {
    try {
        const { nome, telefone, email } = req.body;

        // Validação dos campos obrigatórios
        if (!nome || !telefone || !email) {
            return res.status(400).json({ mensagem: "Todos os campos são obrigatórios." });
        }

        const novoCliente = await Cliente.create({
            nome,
            telefone,
            email
        });

        res.status(201).json(novoCliente);
    } catch (erro) {
        res.status(500).json({ mensagem: "Erro ao cadastrar cliente.", erro: erro.message });
    }
};

// Atualizar
exports.atualizar = async (req, res) => {
    try {
        const clienteAtualizado = await Cliente.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true } // Retorna o registro já atualizado
        );

        if (!clienteAtualizado) {
            return res.status(404).json({ mensagem: "Cliente não encontrado." });
        }

        res.json(clienteAtualizado);
    } catch (erro) {
        res.status(500).json({ mensagem: "Erro ao atualizar cliente.", erro: erro.message });
    }
};

// Excluir
exports.excluir = async (req, res) => {
    try {
        const clienteExcluido = await Cliente.findByIdAndDelete(req.params.id);

        if (!clienteExcluido) {
            return res.status(404).json({ mensagem: "Cliente não encontrado." });
        }

        res.json({ mensagem: "Cliente excluído com sucesso." });
    } catch (erro) {
        res.status(500).json({ mensagem: "Erro ao excluir cliente.", erro: erro.message });
    }
};
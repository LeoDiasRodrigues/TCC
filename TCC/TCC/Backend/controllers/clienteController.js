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

// Autenticação / Login
exports.login = async (req, res) => {
    try {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({ mensagem: "E-mail e senha são obrigatórios." });
        }

        const inputFormatado = String(email).trim().toLowerCase();
        const senhaDigitada = String(senha).trim();

        // Busca o cliente pelo e-mail ou pelo nome
        const cliente = await Cliente.findOne({
            $or: [
                { email: inputFormatado },
                { nome: new RegExp(`^${inputFormatado}$`, "i") }
            ]
        });

        if (!cliente) {
            return res.status(404).json({ mensagem: "Usuário/E-mail não encontrado." });
        }

        // Se o cliente no banco não tiver senha ou se a senha for diferente
        if (!cliente.senha || cliente.senha !== senhaDigitada) {
            return res.status(401).json({ mensagem: "Senha incorreta!" });
        }

        // Login bem-sucedido
        res.json(cliente);
    } catch (erro) {
        res.status(500).json({ mensagem: "Erro ao realizar login.", erro: erro.message });
    }
};

// Cadastrar novo cliente
exports.cadastrar = async (req, res) => {
    try {
        const { nome, telefone, email, senha } = req.body;

        if (!nome || !email || !senha) {
            return res.status(400).json({ mensagem: "Nome, e-mail e senha são obrigatórios." });
        }

        const novoCliente = await Cliente.create({
            nome: String(nome).trim(),
            telefone: telefone ? String(telefone).trim() : "(00) 00000-0000",
            email: String(email).trim().toLowerCase(),
            senha: String(senha).trim()
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
            { new: true }
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
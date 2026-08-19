const Agendamento = require("../models/agendamentoModel");

// Listar todos
exports.listar = async (req, res) => {
    try {
        const agendamentos = await Agendamento.find();
        res.json(agendamentos);
    } catch (erro) {
        res.status(500).json({ mensagem: "Erro ao buscar agendamentos.", erro: erro.message });
    }
};

// Cadastrar
exports.cadastrar = async (req, res) => {
    try {
        const { cliente, barbeiro, servico, data, horario, emailCliente, telefoneCliente, valor, status } = req.body;

        // Validação dos campos obrigatórios
        if (!cliente || !barbeiro || !servico || !data || !horario) {
            return res.status(400).json({ mensagem: "Todos os campos são obrigatórios." });
        }

        // 🔍 VERIFICAÇÃO DE HORÁRIO OCUPADO
        // Procura se já existe um agendamento para o mesmo barbeiro, mesma data e mesmo horário
        const agendamentoExistente = await Agendamento.findOne({
            barbeiro: String(barbeiro).trim(),
            data: String(data).trim(),
            horario: String(horario).trim(),
            status: { $ne: "Cancelado" } // Ignora agendamentos que foram cancelados
        });

        if (agendamentoExistente) {
            return res.status(400).json({
                mensagem: `O barbeiro ${barbeiro} já possui um agendamento no dia ${data} às ${horario}. Escolha outro horário.`
            });
        }

        // Cria o agendamento no banco
        const novoAgendamento = await Agendamento.create({
            cliente,
            barbeiro: String(barbeiro).trim(),
            servico,
            data: String(data).trim(),
            horario: String(horario).trim(),
            emailCliente,
            telefoneCliente,
            valor,
            status: status || "Confirmado"
        });

        res.status(201).json(novoAgendamento);
    } catch (erro) {
        res.status(500).json({ mensagem: "Erro ao cadastrar agendamento.", erro: erro.message });
    }
};

// Atualizar
exports.atualizar = async (req, res) => {
    try {
        const agendamentoAtualizado = await Agendamento.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true } // Retorna o registro já atualizado
        );

        if (!agendamentoAtualizado) {
            return res.status(404).json({ mensagem: "Agendamento não encontrado." });
        }

        res.json(agendamentoAtualizado);
    } catch (erro) {
        res.status(500).json({ mensagem: "Erro ao atualizar agendamento.", erro: erro.message });
    }
};

// Excluir
exports.excluir = async (req, res) => {
    try {
        const agendamentoExcluido = await Agendamento.findByIdAndDelete(req.params.id);

        if (!agendamentoExcluido) {
            return res.status(404).json({ mensagem: "Agendamento não encontrado." });
        }

        res.json({ mensagem: "Agendamento excluído com sucesso." });
    } catch (erro) {
        res.status(500).json({ mensagem: "Erro ao excluir agendamento.", erro: erro.message });
    }
};
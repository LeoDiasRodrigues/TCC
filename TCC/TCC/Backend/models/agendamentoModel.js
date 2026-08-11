const mongoose = require("mongoose");

const agendamentoSchema = new mongoose.Schema({
    cliente: { 
        type: String, 
        required: [true, "O cliente é obrigatório."] 
    },
    barbeiro: { 
        type: String, 
        required: [true, "O barbeiro é obrigatório."] 
    },
    servico: { 
        type: String, 
        required: [true, "O serviço é obrigatório."] 
    },
    data: { 
        type: String, 
        required: [true, "A data é obrigatória."] 
    },
    horario: { 
        type: String, 
        required: [true, "O horário é obrigatório."] 
    }
}, { 
    timestamps: true 
});

module.exports = mongoose.model("Agendamento", agendamentoSchema);
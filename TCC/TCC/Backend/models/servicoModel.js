const mongoose = require("mongoose");

const servicoSchema = new mongoose.Schema({
    nome: { 
        type: String, 
        required: [true, "O nome do serviço é obrigatório."] 
    },
    preco: { 
        type: Number, 
        required: [true, "O preço do serviço é obrigatório."] 
    }
}, { 
    timestamps: true 
});

module.exports = mongoose.model("Servico", servicoSchema);
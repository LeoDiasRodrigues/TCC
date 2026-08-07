const mongoose = require("mongoose");

const clienteSchema = new mongoose.Schema({
    nome: { 
        type: String, 
        required: [true, "O nome do cliente é obrigatório."] 
    },
    telefone: { 
        type: String, 
        required: [true, "O telefone do cliente é obrigatório."] 
    },
    email: { 
        type: String, 
        required: [true, "O e-mail do cliente é obrigatório."] 
    }
}, { 
    timestamps: true // Cria automaticamente os campos 'createdAt' e 'updatedAt'
});

module.exports = mongoose.model("Cliente", clienteSchema);
const mongoose = require("mongoose");

const barbeiroSchema = new mongoose.Schema({
    nome: { 
        type: String, 
        required: [true, "O nome do barbeiro é obrigatório."] 
    },
    especialidade: { 
        type: String, 
        required: [true, "A especialidade é obrigatória."] 
    },
    telefone: { 
        type: String, 
        required: [true, "O telefone é obrigatório."] 
    }
}, { 
    timestamps: true 
});

module.exports = mongoose.model("Barbeiro", barbeiroSchema);
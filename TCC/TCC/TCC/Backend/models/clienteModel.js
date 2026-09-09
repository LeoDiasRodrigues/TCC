const mongoose = require("mongoose");

const clienteSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true
    },
    telefone: {
        type: String
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    senha: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model("Cliente", clienteSchema);
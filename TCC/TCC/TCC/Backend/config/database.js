const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB conectado com sucesso!");
    } catch (erro) {
        console.log("Erro ao conectar ao MongoDB:");
        console.error(erro);
        process.exit(1);
    }
};

connectDB();

module.exports = mongoose;
const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

require("./config/database");

app.use("/clientes", require("./routes/clienteRoutes"));
app.use("/barbeiros", require("./routes/barbeiroRoutes"));
app.use("/servicos", require("./routes/servicoRoutes"));
app.use("/agendamentos", require("./routes/agendamentoRoutes"));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
import { useState, useEffect } from "react";
import api from "../services/api";
import "./Dashboard.css";

function Dashboard() {
    const [totalClientes, setTotalClientes] = useState(0);
    const [totalBarbeiros, setTotalBarbeiros] = useState(0);
    const [totalServicos, setTotalServicos] = useState(0);
    const [totalAgendamentos, setTotalAgendamentos] = useState(0);

    useEffect(() => {
        async function carregarDados() {
            try {
                const [
                    resClientes,
                    resBarbeiros,
                    resServicos,
                    resAgendamentos
                ] = await Promise.all([
                    api.get("/clientes"),
                    api.get("/barbeiros"),
                    api.get("/servicos"),
                    api.get("/agendamentos")
                ]);

                setTotalClientes(resClientes.data.length);
                setTotalBarbeiros(resBarbeiros.data.length);
                setTotalServicos(resServicos.data.length);
                setTotalAgendamentos(resAgendamentos.data.length);

            } catch (erro) {
                console.error("Erro ao carregar dados do Dashboard:", erro);
            }
        }

        carregarDados();
    }, []);

    return (
        <div>
            <h2>Dashboard</h2>
            <br />

            <div className="cards">
                <div className="card-box">
                    <h3>Clientes</h3>
                    <h1>{totalClientes}</h1>
                </div>

                <div className="card-box">
                    <h2>Barbeiros</h2>
                    <h1>{totalBarbeiros}</h1>
                </div>

                <div className="card-box">
                    <h3>Serviços</h3>
                    <h1>{totalServicos}</h1>
                </div>

                <div className="card-box">
                    <h3>Agendamentos</h3>
                    <h1>{totalAgendamentos}</h1>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
import { useState, useEffect } from "react";
import api from "../services/api";
import "./Agendamento.css";

function Agendamentos() {
    // Lista principal de agendamentos
    const [agendamentos, setAgendamentos] = useState([]);

    // Listas para preencher os menus do formulário
    const [clientes, setClientes] = useState([]);
    const [barbeiros, setBarbeiros] = useState([]);
    const [servicos, setServicos] = useState([]);

    // Estados dos campos do formulário
    const [cliente, setCliente] = useState("");
    const [barbeiro, setBarbeiro] = useState("");
    const [servico, setServico] = useState("");
    const [data, setData] = useState("");
    const [horario, setHorario] = useState("");

    // Carrega dados iniciais da API
    async function carregarDados() {
        try {
            const [resAgendamentos, resClientes, resBarbeiros, resServicos] = await Promise.all([
                api.get("/agendamentos"),
                api.get("/clientes"),
                api.get("/barbeiros"),
                api.get("/servicos")
            ]);

            setAgendamentos(resAgendamentos.data);
            setClientes(resClientes.data);
            setBarbeiros(resBarbeiros.data);
            setServicos(resServicos.data);
        } catch (erro) {
            console.error("Erro ao carregar dados:", erro);
        }
    }

    useEffect(() => {
        carregarDados();
    }, []);

    // Cadastrar novo agendamento
    async function salvarAgendamento(e) {
        e.preventDefault();

        if (!cliente || !barbeiro || !servico || !data || !horario) {
            alert("Por favor, preencha todos os campos.");
            return;
        }

        try {
            await api.post("/agendamentos", {
                cliente,
                barbeiro,
                servico,
                data,
                horario
            });

            // Reseta o formulário
            setCliente("");
            setBarbeiro("");
            setServico("");
            setData("");
            setHorario("");

            // Recarrega a tabela e atualiza
            carregarDados();
        } catch (erro) {
            console.error("Erro ao cadastrar agendamento:", erro);
        }
    }

    // Cancelar/Excluir agendamento
    async function excluirAgendamento(id) {
        if (window.confirm("Deseja realmente cancelar este agendamento?")) {
            try {
                await api.delete(`/agendamentos/${id}`);
                carregarDados();
            } catch (erro) {
                console.error("Erro ao excluir agendamento:", erro);
            }
        }
    }

    return (
        <div className="agendamento-container mt-4">
            <h2>Gerenciamento de Agendamentos</h2>

            {/* Form de Cadastro */}
            <form onSubmit={salvarAgendamento} className="agendamento-form mb-4">
                <div className="row g-3">
                    <div className="col-md-4">
                        <label className="form-label">Cliente</label>
                        <select 
                            className="form-select" 
                            value={cliente} 
                            onChange={(e) => setCliente(e.target.value)}
                        >
                            <option value="">Selecione o Cliente</option>
                            {clientes.map((c) => (
                                <option key={c.id} value={c.nome}>
                                    {c.nome}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="col-md-4">
                        <label className="form-label">Barbeiro</label>
                        <select 
                            className="form-select" 
                            value={barbeiro} 
                            onChange={(e) => setBarbeiro(e.target.value)}
                        >
                            <option value="">Selecione o Barbeiro</option>
                            {barbeiros.map((b) => (
                                <option key={b.id} value={b.nome}>
                                    {b.nome}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="col-md-4">
                        <label className="form-label">Serviço</label>
                        <select 
                            className="form-select" 
                            value={servico} 
                            onChange={(e) => setServico(e.target.value)}
                        >
                            <option value="">Selecione o Serviço</option>
                            {servicos.map((s) => (
                                <option key={s.id} value={s.nome}>
                                    {s.nome} - R$ {Number(s.preco).toFixed(2)}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="col-md-5">
                        <label className="form-label">Data</label>
                        <input 
                            type="date" 
                            className="form-control" 
                            value={data} 
                            onChange={(e) => setData(e.target.value)} 
                        />
                    </div>

                    <div className="col-md-5">
                        <label className="form-label">Horário</label>
                        <input 
                            type="time" 
                            className="form-control" 
                            value={horario} 
                            onChange={(e) => setHorario(e.target.value)} 
                        />
                    </div>

                    <div className="col-md-2 d-flex align-items-end">
                        <button type="submit" className="btn btn-success w-100">
                            Agendar
                        </button>
                    </div>
                </div>
            </form>

            {/* Tabela de Agendamentos */}
            <h3>Histórico de Agendamentos</h3>

            {agendamentos.length === 0 ? (
                <p className="text-muted">Nenhum agendamento realizado até o momento.</p>
            ) : (
                <div className="table-responsive">
                    <table className="table table-striped table-bordered mt-3">
                        <thead className="table-dark">
                            <tr>
                                <th># ID</th>
                                <th>Cliente</th>
                                <th>Barbeiro</th>
                                <th>Serviço</th>
                                <th>Data</th>
                                <th>Horário</th>
                                <th style={{ width: "100px" }}>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {agendamentos.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.id}</td>
                                    <td>{item.cliente}</td>
                                    <td>{item.barbeiro}</td>
                                    <td>{item.servico}</td>
                                    <td>{item.data}</td>
                                    <td>{item.horario}</td>
                                    <td>
                                        <button 
                                            className="btn btn-danger btn-sm w-100"
                                            onClick={() => excluirAgendamento(item.id)}
                                        >
                                            Cancelar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default Agendamentos;
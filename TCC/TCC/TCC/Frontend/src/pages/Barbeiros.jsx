import { useEffect, useState } from "react";
import api from "../services/api";
import "./Barbeiros.css";

const FORM_VAZIO = { nome: "", especialidade: "", telefone: "" };

export default function Barbeiros() {
    const [barbeiros, setBarbeiros] = useState([]);
    const [form, setForm] = useState(FORM_VAZIO);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [editId, setEditId] = useState(null);

    useEffect(() => { carregarBarbeiros(); }, []);

    // Busca barbeiros da API
    const carregarBarbeiros = async () => {
        try {
            const resposta = await api.get("/barbeiros");
            setBarbeiros(resposta.data);
        } catch (erro) {
            console.error("Erro ao carregar barbeiros:", erro);
        }
    };

    // Limpa estado do formulário
    const reset = () => {
        setForm(FORM_VAZIO);
        setEditId(null);
        setMostrarFormulario(false);
    };

    // Cadastrar ou Editar barbeiro
    const salvar = async (e) => {
        e.preventDefault();
        if (!form.nome || !form.especialidade || !form.telefone) return alert("Preencha todos os campos.");

        try {
            if (editId) {
                await api.put(`/barbeiros/${editId}`, form);
            } else {
                await api.post("/barbeiros", form);
            }
            reset();
            carregarBarbeiros();
        } catch (erro) {
            console.error("Erro ao salvar barbeiro:", erro);
        }
    };

    // Excluir barbeiro
    const excluir = async (id) => {
        if (window.confirm("Deseja realmente excluir este barbeiro?")) {
            try {
                await api.delete(`/barbeiros/${id}`);
                carregarBarbeiros();
            } catch (erro) {
                console.error("Erro ao excluir barbeiro:", erro);
            }
        }
    };

    // Prepara o formulário para edição
    const iniciarEdicao = (barbeiro) => {
        setEditId(barbeiro._id || barbeiro.id);
        setForm({ 
            nome: barbeiro.nome, 
            especialidade: barbeiro.especialidade, 
            telefone: barbeiro.telefone 
        });
        setMostrarFormulario(true);
    };

    return (
        <div>
            <div className="topo-barbeiro">
                <h2>Barbeiros</h2>
                <button
                    className="btn btn-primary"
                    onClick={() => {
                        if (mostrarFormulario) reset();
                        else setMostrarFormulario(true);
                    }}
                >
                    {mostrarFormulario ? "Fechar Formulário" : "Novo Barbeiro"}
                </button>
            </div>

            {/* Formulário integrado */}
            {mostrarFormulario && (
                <form onSubmit={salvar} className="card card-body mb-4 mt-3">
                    <h4 className="mb-3">{editId ? "Editar Barbeiro" : "Novo Barbeiro"}</h4>
                    <div className="row g-2">
                        <div className="col-md-4">
                            <input
                                className="form-control"
                                placeholder="Nome"
                                value={form.nome}
                                onChange={(e) => setForm({ ...form, nome: e.target.value })}
                            />
                        </div>
                        <div className="col-md-4">
                            <input
                                className="form-control"
                                placeholder="Especialidade"
                                value={form.especialidade}
                                onChange={(e) => setForm({ ...form, especialidade: e.target.value })}
                            />
                        </div>
                        <div className="col-md-4">
                            <input
                                className="form-control"
                                placeholder="Telefone"
                                value={form.telefone}
                                onChange={(e) => setForm({ ...form, telefone: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="d-flex gap-2 mt-3">
                        <button type="submit" className={`btn ${editId ? "btn-primary" : "btn-success"}`}>
                            {editId ? "Salvar Alterações" : "Salvar Barbeiro"}
                        </button>
                        <button type="button" className="btn btn-secondary" onClick={reset}>
                            Cancelar
                        </button>
                    </div>
                </form>
            )}

            {/* Tabela de Barbeiros */}
            <div className="table-responsive">
                <table className="table table-striped table-hover mt-3">
                    <thead className="table-dark">
                        <tr>
                            <th>ID</th>
                            <th>Nome</th>
                            <th>Especialidade</th>
                            <th>Telefone</th>
                            <th style={{ width: "160px" }}>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {barbeiros.map((barbeiro) => {
                            const id = barbeiro._id || barbeiro.id;
                            return (
                                <tr key={id}>
                                    <td>{barbeiro._id ? `...${barbeiro._id.slice(-6)}` : barbeiro.id}</td>
                                    <td>{barbeiro.nome}</td>
                                    <td>{barbeiro.especialidade}</td>
                                    <td>{barbeiro.telefone}</td>
                                    <td>
                                        <button
                                            className="btn btn-warning btn-sm me-2"
                                            onClick={() => iniciarEdicao(barbeiro)}
                                        >
                                            Editar
                                        </button>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => excluir(id)}
                                        >
                                            Excluir
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
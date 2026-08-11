import { useEffect, useState } from "react";
import api from "../services/api";
import "./Clientes.css";

const FORM_VAZIO = { nome: "", telefone: "", email: "" };

export default function Clientes() {
    const [clientes, setClientes] = useState([]);
    const [form, setForm] = useState(FORM_VAZIO);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [editId, setEditId] = useState(null);

    useEffect(() => { carregarClientes(); }, []);

    // Busca clientes da API
    const carregarClientes = async () => {
        try {
            const resposta = await api.get("/clientes");
            setClientes(resposta.data);
        } catch (erro) {
            console.error("Erro ao carregar clientes:", erro);
        }
    };

    // Limpa estado do formulário
    const reset = () => {
        setForm(FORM_VAZIO);
        setEditId(null);
        setMostrarFormulario(false);
    };

    // Cadastrar ou Editar cliente
    const salvar = async (e) => {
        e.preventDefault();
        if (!form.nome || !form.telefone || !form.email) return alert("Preencha todos os campos.");

        try {
            if (editId) {
                await api.put(`/clientes/${editId}`, form);
            } else {
                await api.post("/clientes", form);
            }
            reset();
            carregarClientes();
        } catch (erro) {
            console.error("Erro ao salvar cliente:", erro);
        }
    };

    // Excluir cliente
    const excluir = async (id) => {
        if (window.confirm("Tem certeza que deseja excluir este cliente?")) {
            try {
                await api.delete(`/clientes/${id}`);
                carregarClientes();
            } catch (erro) {
                console.error("Erro ao excluir cliente:", erro);
            }
        }
    };

    // Prepara o formulário para edição
    const iniciarEdicao = (cliente) => {
        setEditId(cliente._id || cliente.id);
        setForm({ nome: cliente.nome, telefone: cliente.telefone, email: cliente.email });
        setMostrarFormulario(true);
    };

    return (
        <div>
            <div className="topo-cliente">
                <h2>Clientes</h2>
                <button
                    className="btn btn-primary"
                    onClick={() => {
                        if (mostrarFormulario) reset();
                        else setMostrarFormulario(true);
                    }}
                >
                    {mostrarFormulario ? "Fechar Formulário" : "Novo Cliente"}
                </button>
            </div>

            {/* Formulário integrado */}
            {mostrarFormulario && (
                <form onSubmit={salvar} className="card card-body mb-4 mt-3">
                    <h4 className="mb-3">{editId ? "Editar Cliente" : "Novo Cliente"}</h4>
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
                                placeholder="Telefone"
                                value={form.telefone}
                                onChange={(e) => setForm({ ...form, telefone: e.target.value })}
                            />
                        </div>
                        <div className="col-md-4">
                            <input
                                className="form-control"
                                type="email"
                                placeholder="Email"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="d-flex gap-2 mt-3">
                        <button type="submit" className={`btn ${editId ? "btn-primary" : "btn-success"}`}>
                            {editId ? "Salvar Alterações" : "Salvar Cliente"}
                        </button>
                        <button type="button" className="btn btn-secondary" onClick={reset}>
                            Cancelar
                        </button>
                    </div>
                </form>
            )}

            {/* Tabela de Clientes */}
            <div className="table-responsive">
                <table className="table table-striped table-hover mt-3">
                    <thead className="table-dark">
                        <tr>
                            <th>ID</th>
                            <th>Nome</th>
                            <th>Telefone</th>
                            <th>Email</th>
                            <th style={{ width: "160px" }}>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clientes.map((cliente) => {
                            const id = cliente._id || cliente.id;
                            return (
                                <tr key={id}>
                                    <td>{cliente._id ? `...${cliente._id.slice(-6)}` : cliente.id}</td>
                                    <td>{cliente.nome}</td>
                                    <td>{cliente.telefone}</td>
                                    <td>{cliente.email}</td>
                                    <td>
                                        <button
                                            className="btn btn-warning btn-sm me-2"
                                            onClick={() => iniciarEdicao(cliente)}
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
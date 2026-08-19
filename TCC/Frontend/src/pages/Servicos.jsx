import { useState, useEffect } from "react";
import api from "../services/api";

const FORM_VAZIO = { nome: "", preco: "" };

export default function Servicos() {
    const [servicos, setServicos] = useState([]);
    const [form, setForm] = useState(FORM_VAZIO);
    const [editId, setEditId] = useState(null);

    // Carrega a lista atualizada do backend
    const carregarServicos = async () => {
        try {
            const res = await api.get("/servicos");
            setServicos(res.data);
        } catch (erro) {
            console.error("Erro ao carregar serviços:", erro);
        }
    };

    useEffect(() => { carregarServicos(); }, []);

    // Limpa o formulário e sai do modo de edição
    const reset = () => { setForm(FORM_VAZIO); setEditId(null); };

    // Cadastrar ou Editar serviço
    const salvar = async (e) => {
        e.preventDefault();
        if (!form.nome || !form.preco) return alert("Preencha todos os campos.");

        try {
            if (editId) {
                await api.put(`/servicos/${editId}`, form);
            } else {
                await api.post("/servicos", form);
            }
            reset();
            carregarServicos();
        } catch (erro) {
            console.error("Erro ao salvar serviço:", erro);
        }
    };

    // Excluir serviço
    const excluir = async (id) => {
        if (window.confirm("Tem certeza que deseja excluir este serviço?")) {
            try {
                await api.delete(`/servicos/${id}`);
                carregarServicos();
            } catch (erro) {
                console.error("Erro ao excluir serviço:", erro);
            }
        }
    };

    // Prepara o formulário para edição
    const iniciarEdicao = (item) => {
        setEditId(item._id || item.id);
        setForm({ nome: item.nome, preco: item.preco });
    };

    return (
        <div className="container mt-4">
            <h2>Gerenciamento de Serviços</h2>

            {/* Formulário de Cadastro / Edição */}
            <form onSubmit={salvar} className="mb-4">
                <div className="row g-2">
                    <div className="col">
                        <input
                            className="form-control"
                            placeholder="Nome do serviço"
                            value={form.nome}
                            onChange={(e) => setForm({ ...form, nome: e.target.value })}
                        />
                    </div>
                    <div className="col">
                        <input
                            className="form-control"
                            type="number"
                            step="0.01"
                            placeholder="Preço"
                            value={form.preco}
                            onChange={(e) => setForm({ ...form, preco: e.target.value })}
                        />
                    </div>
                    <div className="col-md-3 d-flex gap-2">
                        <button 
                            type="submit" 
                            className={`btn ${editId ? "btn-primary w-50" : "btn-success w-100"}`}
                        >
                            {editId ? "Salvar" : "Cadastrar"}
                        </button>
                        {editId && (
                            <button type="button" className="btn btn-secondary w-50" onClick={reset}>
                                Cancelar
                            </button>
                        )}
                    </div>
                </div>
            </form>

            {/* Tabela de Serviços */}
            <h3>Histórico de Serviços</h3>
            {!servicos.length ? (
                <p className="text-muted">Nenhum serviço cadastrado ainda.</p>
            ) : (
                <div className="table-responsive">
                    <table className="table table-striped table-bordered mt-3">
                        <thead className="table-dark">
                            <tr>
                                <th># ID</th>
                                <th>Nome do Serviço</th>
                                <th>Preço</th>
                                <th style={{ width: "160px" }}>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {servicos.map((servico) => {
                                const id = servico._id || servico.id;
                                return (
                                    <tr key={id}>
                                        <td>{servico._id ? `...${servico._id.slice(-6)}` : servico.id}</td>
                                        <td>{servico.nome}</td>
                                        <td>R$ {Number(servico.preco).toFixed(2)}</td>
                                        <td>
                                            <div className="d-flex gap-1">
                                                <button 
                                                    className="btn btn-warning btn-sm w-50" 
                                                    onClick={() => iniciarEdicao(servico)}
                                                >
                                                    Editar
                                                </button>
                                                <button 
                                                    className="btn btn-danger btn-sm w-50" 
                                                    onClick={() => excluir(id)}
                                                >
                                                    Excluir
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
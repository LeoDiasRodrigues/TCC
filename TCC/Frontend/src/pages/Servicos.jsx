import { useState, useEffect } from "react";
import api from "../services/api";

// 1. COMPONENTE DO FORMULÁRIO (Salvar Serviço)
function FormServico({ atualizarLista }) {
    const [nome, setNome] = useState("");
    const [preco, setPreco] = useState("");

    async function salvar(e) {
        e.preventDefault();

        if (!nome || !preco) {
            alert("Preencha todos os campos.");
            return;
        }

        try {
            await api.post("/servicos", {
                nome,
                preco
            });

            setNome("");
            setPreco("");

            // Chama a função para recarregar a lista automaticamente
            atualizarLista();
        } catch (erro) {
            console.error("Erro ao salvar serviço:", erro);
        }
    }

    return (
        <form onSubmit={salvar} className="mb-4">
            <div className="row">
                <div className="col">
                    <input
                        className="form-control"
                        placeholder="Nome do serviço"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                    />
                </div>

                <div className="col">
                    <input
                        className="form-control"
                        type="number"
                        placeholder="Preço"
                        value={preco}
                        onChange={(e) => setPreco(e.target.value)}
                    />
                </div>

                <div className="col-2">
                    <button className="btn btn-success w-100">
                        Salvar
                    </button>
                </div>
            </div>
        </form>
    );
}

// 2. COMPONENTE PRINCIPAL (Página de Serviços + Histórico)
function Servicos() {
    const [servicos, setServicos] = useState([]);

    // Busca a lista atualizada de serviços do backend
    async function carregarServicos() {
        try {
            const resposta = await api.get("/servicos");
            setServicos(resposta.data);
        } catch (erro) {
            console.error("Erro ao carregar serviços:", erro);
        }
    }

    // Carrega a lista assim que a página abre
    useEffect(() => {
        carregarServicos();
    }, []);

    // Função para excluir serviço
    async function excluirServico(id) {
        if (window.confirm("Tem certeza que deseja excluir este serviço?")) {
            try {
                await api.delete(`/servicos/${id}`);
                carregarServicos();
            } catch (erro) {
                console.error("Erro ao excluir serviço:", erro);
            }
        }
    }

    return (
        <div className="container mt-4">
            <h2>Gerenciamento de Serviços</h2>
            
            {/* Formulário chamando a atualização da lista */}
            <FormServico atualizarLista={carregarServicos} />

            {/* --- HISTÓRICO / TABELA DE SERVIÇOS --- */}
            <h3 className="mt-4">Histórico de Serviços</h3>

            {servicos.length === 0 ? (
                <p className="text-muted">Nenhum serviço cadastrado ainda.</p>
            ) : (
                <table className="table table-striped table-bordered mt-3">
                    <thead className="table-dark">
                        <tr>
                            <th># ID</th>
                            <th>Nome do Serviço</th>
                            <th>Preço</th>
                            <th style={{ width: "100px" }}>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {servicos.map((servico) => (
                            <tr key={servico.id}>
                                <td>{servico.id}</td>
                                <td>{servico.nome}</td>
                                <td>R$ {Number(servico.preco).toFixed(2)}</td>
                                <td>
                                    <button 
                                        className="btn btn-danger btn-sm w-100"
                                        onClick={() => excluirServico(servico.id)}
                                    >
                                        Excluir
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default Servicos;
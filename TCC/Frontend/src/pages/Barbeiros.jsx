import { useEffect, useState } from "react";
import api from "../services/api";
import FormBarbeiro from "../components/FormBarbeiro";
import "./Barbeiros.css";

function Barbeiros() {

    const [barbeiros, setBarbeiros] = useState([]);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);

    useEffect(() => {
        carregarBarbeiros();
    }, []);

    async function carregarBarbeiros() {

        try {

            const resposta = await api.get("/barbeiros");

            setBarbeiros(resposta.data);

        } catch (erro) {

            console.log(erro);

        }

    }

    async function excluirBarbeiro(id) {

        const confirmar = window.confirm("Deseja excluir este barbeiro?");

        if (!confirmar) return;

        try {

            await api.delete(`/barbeiros/${id}`);

            carregarBarbeiros();

        } catch (erro) {

            console.log(erro);

        }

    }

    return (

        <div>

            <div className="topo-barbeiro">

                <h2>Barbeiros</h2>

                <button
                    className="btn btn-primary"
                    onClick={() => setMostrarFormulario(!mostrarFormulario)}
                >
                    Novo Barbeiro
                </button>

            </div>

            {mostrarFormulario && (
                <FormBarbeiro atualizarLista={carregarBarbeiros} />
            )}

            <table className="table table-striped table-hover">

                <thead className="table-dark">

                    <tr>

                        <th>ID</th>
                        <th>Nome</th>
                        <th>Especialidade</th>
                        <th>Telefone</th>
                        <th>Ações</th>

                    </tr>

                </thead>

                <tbody>

                    {barbeiros.map((barbeiro) => (

                        <tr key={barbeiro.id}>

                            <td>{barbeiro.id}</td>
                            <td>{barbeiro.nome}</td>
                            <td>{barbeiro.especialidade}</td>
                            <td>{barbeiro.telefone}</td>

                            <td>

                                <button
                                    className="btn btn-warning btn-sm me-2"
                                    onClick={() => alert("Editar será implementado depois.")}
                                >
                                    Editar
                                </button>

                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => excluirBarbeiro(barbeiro.id)}
                                >
                                    Excluir
                                </button>

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>

    );

}

export default Barbeiros;
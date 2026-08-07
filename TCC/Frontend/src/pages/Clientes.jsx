import { useEffect, useState } from "react";
import api from "../services/api";
import FormCliente from "../components/FormCliente";
import "./Clientes.css";

function Clientes() {

    const [clientes, setClientes] = useState([]);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);

    useEffect(() => {
        carregarClientes();
    }, []);

    async function carregarClientes() {

        try {

            const resposta = await api.get("/clientes");
            setClientes(resposta.data);

        } catch (erro) {

            console.log(erro);

        }

    }

    return (

        <div>

            <div className="topo-cliente">

                <h2>Clientes</h2>

                <button
                    className="btn btn-primary"
                    onClick={() => setMostrarFormulario(!mostrarFormulario)}
                >
                    Novo Cliente
                </button>

            </div>

            {mostrarFormulario && (
                <FormCliente atualizarLista={carregarClientes} />
            )}

            <table className="table table-striped table-hover">

                <thead className="table-dark">

                    <tr>

                        <th>ID</th>
                        <th>Nome</th>
                        <th>Telefone</th>
                        <th>Email</th>
                        <th>Ações</th>

                    </tr>

                </thead>

                <tbody>

                    {clientes.map((cliente) => (

                        <tr key={cliente.id}>

                            <td>{cliente.id}</td>
                            <td>{cliente.nome}</td>
                            <td>{cliente.telefone}</td>
                            <td>{cliente.email}</td>

                            <td>

                                <button className="btn btn-warning btn-sm me-2">
                                    Editar
                                </button>

                                <button className="btn btn-danger btn-sm">
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

export default Clientes;
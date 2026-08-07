import { useState } from "react";
import api from "../services/api";

function FormCliente({ atualizarLista }) {

    const [nome, setNome] = useState("");
    const [telefone, setTelefone] = useState("");
    const [email, setEmail] = useState("");

    async function salvar(e) {

        e.preventDefault();

        if (!nome || !telefone || !email) {
            alert("Preencha todos os campos.");
            return;
        }

        try {

            await api.post("/clientes", {
                nome,
                telefone,
                email
            });

            setNome("");
            setTelefone("");
            setEmail("");

            atualizarLista();

        } catch (erro) {
            console.log(erro);
        }

    }

    return (

        <form onSubmit={salvar} className="mb-4">

            <div className="row">

                <div className="col">

                    <input
                        className="form-control"
                        placeholder="Nome"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                    />

                </div>

                <div className="col">

                    <input
                        className="form-control"
                        placeholder="Telefone"
                        value={telefone}
                        onChange={(e) => setTelefone(e.target.value)}
                    />

                </div>

                <div className="col">

                    <input
                        className="form-control"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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

export default FormCliente;
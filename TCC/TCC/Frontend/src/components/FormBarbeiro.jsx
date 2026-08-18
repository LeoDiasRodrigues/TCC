import { useState } from "react";
import api from "../services/api";

function FormBarbeiro({ atualizarLista }) {

    const [nome, setNome] = useState("");
    const [especialidade, setEspecialidade] = useState("");
    const [telefone, setTelefone] = useState("");

    async function salvar(e) {

        e.preventDefault();

        if (!nome || !especialidade || !telefone) {
            alert("Preencha todos os campos.");
            return;
        }

        try {

            await api.post("/barbeiros", {
                nome,
                especialidade,
                telefone
            });

            setNome("");
            setEspecialidade("");
            setTelefone("");

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
                        placeholder="Especialidade"
                        value={especialidade}
                        onChange={(e) => setEspecialidade(e.target.value)}
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

                <div className="col-2">

                    <button className="btn btn-success w-100">
                        Salvar
                    </button>

                </div>

            </div>

        </form>

    );

}

export default FormBarbeiro;
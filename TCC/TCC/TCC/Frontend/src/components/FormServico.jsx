import { useState } from "react";
import api from "../services/api";

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

export default FormServico;
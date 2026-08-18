import { useState, useEffect } from "react";
import api from "../services/api";
import "./Agendamento.css";

const FORM_VAZIO = { cliente: "", barbeiro: "", servico: "", data: "", horario: "" };

// Horários de 30 em 30 min (09:00 até 20:00, sem intervalo de 12:00 às 13:30)
const HORARIOS = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", 
    "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00"
];

export default function Agendamentos() {
    const [listas, setListas] = useState({ agendamentos: [], clientes: [], barbeiros: [], servicos: [] });
    const [form, setForm] = useState(FORM_VAZIO);
    const [editId, setEditId] = useState(null);

    const carregarDados = async () => {
        const [a, c, b, s] = await Promise.all([
            api.get("/agendamentos"), api.get("/clientes"), api.get("/barbeiros"), api.get("/servicos")
        ]);
        setListas({ agendamentos: a.data, clientes: c.data, barbeiros: b.data, servicos: s.data });
    };

    useEffect(() => { carregarDados(); }, []);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
    const reset = () => { setForm(FORM_VAZIO); setEditId(null); };

    const salvar = async (e) => {
        e.preventDefault();
        if (Object.values(form).some(v => !v)) return alert("Preencha todos os campos.");

        // Validação: impede o mesmo barbeiro no mesmo dia e horário
        const conflito = agendamentos.some(item => {
            const ehOPróprioItem = editId && (item._id === editId || item.id === editId);
            if (ehOPróprioItem) return false;

            return item.barbeiro === form.barbeiro && 
                   item.data === form.data && 
                   item.horario === form.horario;
        });

        if (conflito) {
            return alert(`O barbeiro ${form.barbeiro} já possui um agendamento dia ${form.data} às ${form.horario}!`);
        }
        
        try {
            editId ? await api.put(`/agendamentos/${editId}`, form) : await api.post("/agendamentos", form);
            reset();
            carregarDados();
        } catch (erro) { console.error("Erro ao salvar:", erro); }
    };

    const excluir = async (id) => {
        if (window.confirm("Deseja realmente cancelar este agendamento?")) {
            await api.delete(`/agendamentos/${id}`);
            carregarDados();
        }
    };

    const iniciarEdicao = (item) => {
        setEditId(item._id);
        setForm({ cliente: item.cliente, barbeiro: item.barbeiro, servico: item.servico, data: item.data, horario: item.horario });
    };

    const { agendamentos, clientes, barbeiros, servicos } = listas;

    return (
        <div className="agendamento-container mt-4">
            <h2>Gerenciamento de Agendamentos</h2>

            <form onSubmit={salvar} className="agendamento-form mb-4">
                <div className="row g-3">
                    <div className="col-md-4">
                        <label className="form-label">Cliente</label>
                        <select name="cliente" className="form-select" value={form.cliente} onChange={handleChange}>
                            <option value="">Selecione o Cliente</option>
                            {clientes.map(c => <option key={c._id || c.id} value={c.nome}>{c.nome}</option>)}
                        </select>
                    </div>

                    <div className="col-md-4">
                        <label className="form-label">Barbeiro</label>
                        <select name="barbeiro" className="form-select" value={form.barbeiro} onChange={handleChange}>
                            <option value="">Selecione o Barbeiro</option>
                            {barbeiros.map(b => <option key={b._id || b.id} value={b.nome}>{b.nome}</option>)}
                        </select>
                    </div>

                    <div className="col-md-4">
                        <label className="form-label">Serviço</label>
                        <select name="servico" className="form-select" value={form.servico} onChange={handleChange}>
                            <option value="">Selecione o Serviço</option>
                            {servicos.map(s => (
                                <option key={s._id || s.id} value={s.nome}>
                                    {s.nome} - R$ {Number(s.preco).toFixed(2)}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="col-md-5">
                        <label className="form-label">Data</label>
                        <input type="date" name="data" className="form-control" value={form.data} onChange={handleChange} />
                    </div>

                    <div className="col-md-5">
                        <label className="form-label">Horário</label>
                        <select name="horario" className="form-select" value={form.horario} onChange={handleChange}>
                            <option value="">Selecione o Horário</option>
                            {HORARIOS.map(h => <option key={h} value={h}>{h}</option>)}
                        </select>
                    </div>

                    <div className="col-md-2 d-flex align-items-end gap-2">
                        <button type="submit" className={`btn ${editId ? "btn-primary w-50" : "btn-success w-100"}`}>
                            {editId ? "Salvar" : "Agendar"}
                        </button>
                        {editId && <button type="button" className="btn btn-secondary w-50" onClick={reset}>Cancelar</button>}
                    </div>
                </div>
            </form>

            <h3>Histórico de Agendamentos</h3>
            {!agendamentos.length ? (
                <p className="text-muted">Nenhum agendamento realizado até o momento.</p>
            ) : (
                <div className="table-responsive">
                    <table className="table table-striped table-bordered mt-3">
                        <thead className="table-dark">
                            <tr>
                                <th># ID</th><th>Cliente</th><th>Barbeiro</th><th>Serviço</th><th>Data</th><th>Horário</th>
                                <th style={{ width: "160px" }}>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {agendamentos.map(item => (
                                <tr key={item._id || item.id}>
                                    <td>{item._id ? `...${item._id.slice(-6)}` : item.id}</td>
                                    <td>{item.cliente}</td><td>{item.barbeiro}</td><td>{item.servico}</td>
                                    <td>{item.data}</td><td>{item.horario}</td>
                                    <td>
                                        <div className="d-flex gap-1">
                                            <button className="btn btn-warning btn-sm w-50" onClick={() => iniciarEdicao(item)}>Editar</button>
                                            <button className="btn btn-danger btn-sm w-50" onClick={() => excluir(item._id || item.id)}>Cancelar</button>
                                        </div>
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
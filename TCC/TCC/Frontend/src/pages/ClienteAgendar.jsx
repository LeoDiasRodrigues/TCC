import { useState, useEffect, useContext } from "react";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import ClienteNavbar from "../components/ClienteNavbar";

export default function ClienteAgendar() {
    const { usuario } = useContext(AuthContext);

    const [servicos, setServicos] = useState([]);
    const [barbeiros, setBarbeiros] = useState([]);
    const [agendamentos, setAgendamentos] = useState([]);

    const [servicoSel, setServicoSel] = useState("");
    const [barbeiroSel, setBarbeiroSel] = useState("");
    const [data, setData] = useState("");
    const [horario, setHorario] = useState("");
    
    const [erro, setErro] = useState("");
    const [sucesso, setSucesso] = useState(false);
    const [carregando, setCarregando] = useState(false);

    const horariosDisponiveis = [
        "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
        "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00"
    ];

    const getPrecoServico = (s) => {
        if (!s) return 0;
        const val = s.preco ?? s.valor ?? s.price ?? s.valorTotal ?? 0;
        if (typeof val === "number") return val;
        const num = parseFloat(String(val).replace("R$", "").replace(",", ".").trim());
        return isNaN(num) ? 0 : num;
    };

    const carregarDados = async () => {
        try {
            const [resServicos, resBarbeiros, resAgendamentos] = await Promise.all([
                api.get("/servicos").catch(() => ({ data: [] })),
                api.get("/barbeiros").catch(() => ({ data: [] })),
                api.get("/agendamentos").catch(() => ({ data: [] }))
            ]);
            setServicos(Array.isArray(resServicos.data) ? resServicos.data : []);
            setBarbeiros(Array.isArray(resBarbeiros.data) ? resBarbeiros.data : []);
            setAgendamentos(Array.isArray(resAgendamentos.data) ? resAgendamentos.data : []);
        } catch (err) {
            console.error("Erro ao carregar dados:", err);
        }
    };

    useEffect(() => {
        carregarDados();
    }, []);

    const objServico = servicos.find(s => String(s._id || s.id) === String(servicoSel));
    const objBarbeiro = barbeiros.find(b => String(b._id || b.id) === String(barbeiroSel));
    const valorTotal = getPrecoServico(objServico);

    // Função que verifica se determinado horário já está agendado para o barbeiro e data escolhidos
    const isHorarioOcupado = (h) => {
        if (!barbeiroSel || !data) return false;
        const nomeBarbeiro = objBarbeiro?.nome;

        return agendamentos.some(a => {
            const mesmoBarbeiro = (
                String(a.barbeiro).toLowerCase() === String(barbeiroSel).toLowerCase() ||
                (nomeBarbeiro && String(a.barbeiro).toLowerCase() === String(nomeBarbeiro).toLowerCase())
            );
            const mesmaData = String(a.data) === String(data);
            const mesmoHorario = String(a.horario) === String(h);
            const naoCancelado = a.status !== "Cancelado";

            return mesmoBarbeiro && mesmaData && mesmoHorario && naoCancelado;
        });
    };

    // Verifica se a combinação atual (barbeiro + data + horário) já está ocupada
    const conflitoAgendamento = horario ? isHorarioOcupado(horario) : false;

    const handleAgendar = async (e) => {
        e.preventDefault();
        setErro("");

        if (!servicoSel || !barbeiroSel || !data || !horario) {
            return setErro("Preencha todos os campos!");
        }

        if (conflitoAgendamento) {
            return setErro(`O barbeiro ${objBarbeiro?.nome || ""} já possui um agendamento no dia ${data} às ${horario}. Escolha outro horário.`);
        }

        setCarregando(true);
        try {
            await api.post("/agendamentos", {
                cliente: usuario?.nome || "Cliente",
                emailCliente: usuario?.email?.toLowerCase() || "",
                telefoneCliente: usuario?.telefone || "",
                servico: objServico?.nome || "Serviço",
                barbeiro: objBarbeiro?.nome || "Barbeiro",
                valor: valorTotal,
                preco: valorTotal,
                price: valorTotal,
                data,
                horario,
                status: "Confirmado"
            });
            setSucesso(true);
            await carregarDados(); // Atualiza a lista de agendamentos
        } catch (err) {
            const msgApi = err.response?.data?.mensagem;
            setErro(msgApi || "Erro ao realizar agendamento. Esse horário pode já ter sido preenchido.");
        } finally {
            setCarregando(false);
        }
    };

    return (
        <div style={{ minHeight: "100vh", backgroundColor: "#0d0d0d", color: "#fff" }}>
            <ClienteNavbar />
            <main style={{ maxWidth: "600px", margin: "2rem auto", padding: "1rem" }}>
                <div style={{ backgroundColor: "#161616", border: "1px solid #282828", borderRadius: "12px", padding: "2rem" }}>
                    <h2 style={{ color: "#d4af37", marginBottom: "0.5rem" }}>Novo Agendamento</h2>
                    <p style={{ color: "#888", fontSize: "0.85rem", marginBottom: "1.5rem" }}>Agendando como: <strong>{usuario?.email}</strong></p>

                    {erro && (
                        <div style={{ backgroundColor: "rgba(239, 68, 68, 0.2)", color: "#f87171", padding: "12px", borderRadius: "8px", fontSize: "0.85rem", marginBottom: "1rem", border: "1px solid rgba(239, 68, 68, 0.4)" }}>
                            ⚠️ {erro}
                        </div>
                    )}

                    {sucesso ? (
                        <div style={{ textAlign: "center", padding: "1rem" }}>
                            <h3>Agendamento Realizado!</h3>
                            <p style={{ color: "#aaa" }}>Seu horário foi salvo com sucesso.</p>
                            <button onClick={() => { setSucesso(false); setHorario(""); setErro(""); }} style={{ marginTop: "1rem", padding: "10px 20px", background: "#d4af37", border: "none", fontWeight: "bold", borderRadius: "8px", cursor: "pointer" }}>
                                Novo Agendamento
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleAgendar} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                            <div>
                                <label style={{ display: "block", color: "#aaa", fontSize: "0.85rem", marginBottom: "4px" }}>Serviço</label>
                                <select value={servicoSel} onChange={(e) => setServicoSel(e.target.value)} style={{ width: "100%", padding: "10px", background: "#222", border: "1px solid #333", color: "#fff", borderRadius: "8px" }}>
                                    <option value="">Selecione o Serviço...</option>
                                    {servicos.map(s => <option key={s._id || s.id} value={s._id || s.id}>{s.nome} — R$ {getPrecoServico(s).toFixed(2)}</option>)}
                                </select>
                            </div>

                            <div>
                                <label style={{ display: "block", color: "#aaa", fontSize: "0.85rem", marginBottom: "4px" }}>Barbeiro</label>
                                <select value={barbeiroSel} onChange={(e) => { setBarbeiroSel(e.target.value); setErro(""); }} style={{ width: "100%", padding: "10px", background: "#222", border: "1px solid #333", color: "#fff", borderRadius: "8px" }}>
                                    <option value="">Selecione o Barbeiro...</option>
                                    {barbeiros.map(b => <option key={b._id || b.id} value={b._id || b.id}>{b.nome}</option>)}
                                </select>
                            </div>

                            <div style={{ display: "flex", gap: "1rem" }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: "block", color: "#aaa", fontSize: "0.85rem", marginBottom: "4px" }}>Data</label>
                                    <input type="date" value={data} min={new Date().toISOString().split("T")[0]} onChange={(e) => { setData(e.target.value); setErro(""); }} style={{ width: "100%", padding: "10px", background: "#222", border: "1px solid #333", color: "#fff", borderRadius: "8px" }} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: "block", color: "#aaa", fontSize: "0.85rem", marginBottom: "4px" }}>Horário</label>
                                    <select value={horario} onChange={(e) => { setHorario(e.target.value); setErro(""); }} style={{ width: "100%", padding: "10px", background: "#222", border: "1px solid #333", color: "#fff", borderRadius: "8px" }}>
                                        <option value="">Selecione...</option>
                                        {horariosDisponiveis.map(h => {
                                            const ocupado = isHorarioOcupado(h);
                                            return (
                                                <option key={h} value={h} disabled={ocupado} style={{ color: ocupado ? "#888" : "#fff" }}>
                                                    {h} {ocupado ? "(Já agendado)" : ""}
                                                </option>
                                            );
                                        })}
                                    </select>
                                </div>
                            </div>

                            {conflitoAgendamento && (
                                <p style={{ color: "#f87171", fontSize: "0.85rem", margin: "0" }}>
                                     O barbeiro <strong>{objBarbeiro?.nome}</strong> já possui um agendamento no dia <strong>{data}</strong> às <strong>{horario}</strong>. Por favor, escolha outro horário.
                                </p>
                            )}

                            <div style={{ backgroundColor: "#222", padding: "1rem", borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <span>Total:</span>
                                <strong style={{ fontSize: "1.2rem", color: "#d4af37" }}>R$ {valorTotal.toFixed(2)}</strong>
                            </div>

                            <button type="submit" disabled={carregando || conflitoAgendamento} style={{ padding: "12px", background: conflitoAgendamento ? "#444" : "#d4af37", color: conflitoAgendamento ? "#888" : "#000", fontWeight: "bold", border: "none", borderRadius: "8px", cursor: conflitoAgendamento ? "not-allowed" : "pointer" }}>
                                {carregando ? "Agendando..." : "Confirmar Agendamento"}
                            </button>
                        </form>
                    )}
                </div>
            </main>
        </div>
    );
}
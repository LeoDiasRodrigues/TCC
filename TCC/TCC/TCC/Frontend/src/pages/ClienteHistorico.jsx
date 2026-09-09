import { useEffect, useState, useContext } from "react";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import ClienteNavbar from "../components/ClienteNavbar";

export default function ClienteHistorico() {
    const { usuario } = useContext(AuthContext);
    const [historico, setHistorico] = useState([]);
    const [carregando, setCarregando] = useState(true);

    const formatarValor = (ag) => {
        const val = ag.valor ?? ag.preco ?? ag.price ?? ag.valorTotal ?? ag.servicoPreco;

        if (val === undefined || val === null) return "0,00";

        if (typeof val === "number") {
            return val.toFixed(2).replace(".", ",");
        }

        const valLimpo = String(val).replace("R$", "").replace(",", ".").trim();
        const num = parseFloat(valLimpo);

        return isNaN(num) ? "0,00" : num.toFixed(2).replace(".", ",");
    };

    const handleExcluir = async (id) => {
        const confirmou = window.confirm("Tem certeza que deseja cancelar este agendamento?");
        if (!confirmou) return;

        try {
            await api.delete(`/agendamentos/${id}`);
            setHistorico((prevHistorico) => prevHistorico.filter((ag) => (ag._id || ag.id) !== id));
        } catch (err) {
            console.error("Erro ao excluir agendamento:", err);
            alert("Não foi possível excluir o agendamento. Tente novamente.");
        }
    };

    useEffect(() => {
        const carregarHistorico = async () => {
            try {
                const res = await api.get("/agendamentos");
                const todos = Array.isArray(res.data) ? res.data : [];

                const emailLogado = usuario?.email?.toLowerCase();
                const nomeLogado = usuario?.nome?.toLowerCase();

                const doCliente = todos.filter(item => {
                    const emailAg = (item.emailCliente || item.email || "").toLowerCase();
                    const nomeAg = (item.cliente || item.nomeCliente || "").toLowerCase();

                    return (emailLogado && emailAg === emailLogado) || 
                           (nomeLogado && nomeAg === nomeLogado) ||
                           (item.clienteId && item.clienteId === usuario?.id);
                });

                setHistorico(doCliente);
            } catch (err) {
                console.error("Erro ao carregar histórico:", err);
            } finally {
                setCarregando(false);
            }
        };

        if (usuario) {
            carregarHistorico();
        } else {
            setCarregando(false);
        }
    }, [usuario]);

    return (
        <div style={{ minHeight: "100vh", backgroundColor: "#0d0d0d", color: "#fff" }}>
            <ClienteNavbar />
            <main style={{ maxWidth: "800px", margin: "2rem auto", padding: "1rem" }}>
                <h2 style={{ color: "#d4af37", marginBottom: "0.5rem" }}>Meus Agendamentos</h2>
                <p style={{ color: "#888", fontSize: "0.85rem", marginBottom: "1.5rem" }}>
                    Histórico registrado para: {usuario?.nome || usuario?.email}
                </p>

                {carregando ? (
                    <p style={{ color: "#aaa" }}>Carregando histórico...</p>
                ) : historico.length === 0 ? (
                    <div style={{ backgroundColor: "#161616", padding: "2rem", borderRadius: "12px", border: "1px solid #282828", textAlign: "center" }}>
                        <p style={{ color: "#888" }}>Nenhum agendamento encontrado para a sua conta.</p>
                    </div>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                        {historico.map((ag) => {
                            const idAgendamento = ag._id || ag.id;
                            return (
                                <div key={idAgendamento} style={{ backgroundColor: "#161616", border: "1px solid #282828", borderRadius: "8px", padding: "1rem 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <div>
                                        <h4 style={{ color: "#d4af37", margin: 0 }}>{ag.servico}</h4>
                                        <p style={{ color: "#aaa", fontSize: "0.85rem", margin: "4px 0" }}>Barbeiro: {ag.barbeiro}</p>
                                        <span style={{ fontSize: "0.8rem", color: "#888" }}> {ag.data} às {ag.horario || ag.hora}</span>
                                    </div>
                                    <div style={{ textAlign: "right", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.25rem" }}>
                                        
                                        <span style={{ fontSize: "0.75rem", color: "#4ade80" }}>{ag.status || "Confirmado"}</span>
                                        
                                        <button
                                            onClick={() => handleExcluir(idAgendamento)}
                                            style={{
                                                padding: "6px 13px",
                                                backgroundColor: "rgba(239, 68, 68, 0.2)",
                                                border: "1px solid rgba(239, 68, 68, 0.4)",
                                                color: "#f87171",
                                                borderRadius: "3px",
                                                cursor: "pointer",
                                                fontWeight: "bold",
                                                fontSize: "0.75rem",
                                                marginTop: "0.5rem",
                                                transition: "all 0.2s ease"
                                            }}
                                            onMouseOver={(e) => {
                                                e.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.35)";
                                                e.currentTarget.style.borderColor = "rgba(239, 68, 68, 0.6)";
                                            }}
                                            onMouseOut={(e) => {
                                                e.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.2)";
                                                e.currentTarget.style.borderColor = "rgba(239, 68, 68, 0.4)";
                                            }}
                                        >
                                            Cancelar Agendamento
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
}
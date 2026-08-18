import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";

export default function Gerenciamento() {
    const [agendamentos, setAgendamentos] = useState([]);
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        carregarAgendamentos();
    }, []);

    const carregarAgendamentos = async () => {
        try {
            const res = await api.get("/agendamentos");
            setAgendamentos(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error("Erro ao carregar agendamentos:", err);
        }
    };

    const handleSair = () => {
        if (logout) logout();
        localStorage.clear();
        navigate("/login");
    };

    return (
        <div style={{ minHeight: "100vh", backgroundColor: "#0d0d0d", color: "#fff", padding: "2rem" }}>
            <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
                
                {/* CABEÇALHO DA BARBEARIA */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", borderBottom: "1px solid #222", paddingBottom: "1rem" }}>
                    <div>
                        <h2 style={{ color: "#d4af37", margin: 0 }}>Painel do Barbeiro / Gerente</h2>
                        <span style={{ color: "#666", fontSize: "0.85rem" }}>BarberPro Management</span>
                    </div>

                    {/* BOTÃO SAIR */}
                    <button 
                        onClick={handleSair} 
                        style={{ 
                            padding: "8px 18px", 
                            backgroundColor: "rgba(239, 68, 68, 0.2)", 
                            border: "1px solid rgba(239, 68, 68, 0.4)", 
                            color: "#f87171", 
                            borderRadius: "6px", 
                            cursor: "pointer",
                            fontWeight: "bold"
                        }}
                    >
                         Sair
                    </button>
                </div>

                <div style={{ backgroundColor: "#161616", border: "1px solid #282828", borderRadius: "12px", padding: "1.5rem" }}>
                    <h3 style={{ marginBottom: "1rem" }}>Agendamentos Confirmados</h3>
                    
                    {agendamentos.length === 0 ? (
                        <p style={{ color: "#888" }}>Nenhum agendamento encontrado no banco de dados.</p>
                    ) : (
                        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                            <thead>
                                <tr style={{ borderBottom: "1px solid #333", color: "#d4af37" }}>
                                    <th style={{ padding: "10px" }}>Cliente</th>
                                    <th style={{ padding: "10px" }}>Telefone</th>
                                    <th style={{ padding: "10px" }}>Serviço</th>
                                    <th style={{ padding: "10px" }}>Barbeiro</th>
                                    <th style={{ padding: "10px" }}>Data e Horário</th>
                                    <th style={{ padding: "10px" }}>Valor</th>
                                </tr>
                            </thead>
                            <tbody>
                                {agendamentos.map((item) => (
                                    <tr key={item._id || item.id} style={{ borderBottom: "1px solid #222" }}>
                                        <td style={{ padding: "10px" }}>{item.cliente}</td>
                                        <td style={{ padding: "10px", color: "#aaa" }}>{item.telefoneCliente || "-"}</td>
                                        <td style={{ padding: "10px" }}>{item.servico}</td>
                                        <td style={{ padding: "10px" }}>{item.barbeiro}</td>
                                        <td style={{ padding: "10px", color: "#4ade80" }}>{item.data} às {item.horario}</td>
                                        <td style={{ padding: "10px", fontWeight: "bold" }}>R$ {Number(item.valor || 0).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}
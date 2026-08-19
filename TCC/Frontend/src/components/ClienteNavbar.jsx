import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function ClienteNavbar() {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSair = () => {
        if (logout) logout();
        localStorage.clear();
        navigate("/login");
    };

    return (
        <header style={{
            backgroundColor: "#161616",
            borderBottom: "1px solid #282828",
            padding: "1rem 2rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
        }}>
            <h3 
                onClick={() => navigate("/cliente/home")} 
                style={{ color: "#d4af37", cursor: "pointer", margin: 0 }}
            >
                BarberPro
            </h3>
            
            <nav style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                <button 
                    type="button"
                    onClick={() => navigate("/cliente/agendar")} 
                    style={{ background: "none", border: "none", color: "#ccc", cursor: "pointer", fontWeight: "600" }}
                >
                    Agendar
                </button>
                <button 
                    type="button"
                    onClick={() => navigate("/cliente/historico")} 
                    style={{ background: "none", border: "none", color: "#ccc", cursor: "pointer", fontWeight: "600" }}
                >
                    Meus Agendamentos
                </button>
                
                <button 
                    type="button"
                    onClick={handleSair} 
                    style={{ 
                        backgroundColor: "rgba(239, 68, 68, 0.2)", 
                        border: "1px solid rgba(239, 68, 68, 0.4)", 
                        color: "#f87171", 
                        borderRadius: "6px", 
                        padding: "6px 14px", 
                        cursor: "pointer", 
                        fontWeight: "bold" 
                    }}
                >
                    Sair
                </button>
            </nav>
        </header>
    );
}
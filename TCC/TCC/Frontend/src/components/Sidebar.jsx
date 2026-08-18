import { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./Sidebar.css";

function Sidebar() {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useContext(AuthContext);

    const handleSair = () => {
        if (logout) logout();
        localStorage.clear();
        navigate("/login");
    };

    const menuItems = [
        {
            to: "/dashboard",
            label: "Dashboard",
        },
        {
            to: "/clientes",
            label: "Clientes",
        },
        {
            to: "/barbeiros",
            label: "Barbeiros",
        },
        {
            to: "/servicos",
            label: "Serviços",
        },
        {
            to: "/agendamentos",
            label: "Agendamentos",
        },
    ];

    return (
        <aside className="sidebar" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>

            <div>
                {/* Logo */}
                <div className="brand">
                    <div>
                        <h2>BARBER</h2>
                        <span>PRO</span>
                    </div>
                </div>

                {/* Menu */}
                <div className="menu-title">
                    MENU PRINCIPAL
                </div>

                <nav>
                    {menuItems.map((item) => (
                        <Link
                            key={item.to}
                            to={item.to}
                            className={
                                location.pathname === item.to
                                    ? "active"
                                    : ""
                            }
                        >
                            <span className="menu-icon">
                                {item.icon}
                            </span>

                            <span>
                                {item.label}
                            </span>
                        </Link>
                    ))}
                </nav>
            </div>

            {/* Rodapé e Botão Sair */}
            <div className="sidebar-footer" style={{ padding: "1rem", borderTop: "1px solid #282828" }}>
                <button
                    onClick={handleSair}
                    style={{
                        width: "100%",
                        padding: "10px",
                        backgroundColor: "rgba(239, 68, 68, 0.2)",
                        border: "1px solid rgba(239, 68, 68, 0.4)",
                        color: "#f87171",
                        borderRadius: "8px",
                        fontWeight: "bold",
                        cursor: "pointer",
                        marginBottom: "1rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px"
                    }}
                >
                    Sair
                </button>

                <span>BARBER PRO</span>
                <small style={{ display: "block" }}>
                    Gestão da sua barbearia
                </small>
            </div>

        </aside>
    );
}

export default Sidebar;
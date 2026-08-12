import { Link, useLocation } from "react-router-dom";

import "./Sidebar.css";

function Sidebar() {
    const location = useLocation();

    const menuItems = [
        {
            to: "/",
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
        <aside className="sidebar">

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


            {/* Rodapé */}
            <div className="sidebar-footer">

                <span>BARBER PRO</span>

                <small>
                    Gestão da sua barbearia
                </small>

            </div>

        </aside>
    );
}

export default Sidebar;
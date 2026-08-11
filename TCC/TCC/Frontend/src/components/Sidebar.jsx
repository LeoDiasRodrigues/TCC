import { Link } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
    return (
        <div className="sidebar">

            <h2 className="logo">BARBER PRO</h2>

            <Link to="/">Dashboard</Link>

            <Link to="/clientes">Clientes</Link>

            <Link to="/barbeiros">Barbeiros</Link>

            <Link to="/servicos">Serviços</Link>

            <Link to="/agendamentos">Agendamentos</Link>

        </div>
    );
}

export default Sidebar;
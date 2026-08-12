import { BrowserRouter, Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

import Dashboard from "./pages/Dashboard";
import Clientes from "./pages/Clientes";
import Barbeiros from "./pages/Barbeiros";
import Servicos from "./pages/Servicos";
import Agendamentos from "./pages/Agendamentos";

import "./App.css";

function App() {
    return (
        <BrowserRouter>

            <Sidebar />

            <div className="conteudo">

                <Navbar />

                <Routes>

                    <Route path="/" element={<Dashboard />} />

                    <Route path="/clientes" element={<Clientes />} />

                    <Route path="/barbeiros" element={<Barbeiros />} />

                    <Route path="/servicos" element={<Servicos />} />

                    <Route path="/agendamentos" element={<Agendamentos />} />

                </Routes>

            </div>

        </BrowserRouter>
    );
}

export default App;
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

// Componentes do Painel Admin
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

// Páginas
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Clientes from "./pages/Clientes";
import Barbeiros from "./pages/Barbeiros";
import Servicos from "./pages/Servicos";
import Agendamentos from "./pages/Agendamentos";
import ClienteAgendar from "./pages/ClienteAgendar";
import ClienteHistorico from "./pages/ClienteHistorico";
import Gerenciamento from "./pages/Gerenciamento";

import "./App.css";

// Layout do Painel do Barbeiro / Gerente (Exibe Sidebar e Navbar)
function AdminLayout() {
    return (
        <div style={{ display: "flex", minHeight: "100vh" }}>
            <Sidebar />
            <div className="conteudo" style={{ flex: 1 }}>
                <Navbar />
                <Outlet />
            </div>
        </div>
    );
}

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    {/* 1. Tela Inicial e Login (Sem Sidebar) */}
                    <Route path="/" element={<Login />} />
                    <Route path="/login" element={<Login />} />

                    {/* 2. Área do Cliente (Sem Sidebar do Painel) */}
                    <Route path="/cliente/home" element={<ClienteAgendar />} />
                    <Route path="/cliente/agendar" element={<ClienteAgendar />} />
                    <Route path="/cliente/historico" element={<ClienteHistorico />} />

                    {/* 3. Área do Gerenciamento / Barbeiro (Com Sidebar e Navbar) */}
                    <Route element={<AdminLayout />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/gerenciamento" element={<Gerenciamento />} />
                        <Route path="/clientes" element={<Clientes />} />
                        <Route path="/barbeiros" element={<Barbeiros />} />
                        <Route path="/servicos" element={<Servicos />} />
                        <Route path="/agendamentos" element={<Agendamentos />} />
                    </Route>

                    {/* Rota padrão para links inexistentes */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import "../components/Sidebar.css";


export default function Login() {
    const [isCadastro, setIsCadastro] = useState(false);

    const [nome, setNome] = useState("");
    const [telefone, setTelefone] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");

    const [erro, setErro] = useState("");
    const [carregando, setCarregando] = useState(false);

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErro("");
        setCarregando(true);

        const inputUsuario = email.trim().toLowerCase();
        const senhaDigitada = senha.trim();

        try {
            // 1. VALIDAÇÃO DE USUÁRIO FIXO ADMIN (admin / 1234)
            if (inputUsuario === "admin" || inputUsuario === "admin@barber.com") {
                if (senhaDigitada !== "1234") {
                    setErro("Senha incorreta para a conta de administrador!");
                    setCarregando(false);
                    return;
                }

                const adminUser = {
                    id: "admin-fixed",
                    nome: "Administrador",
                    email: "admin@barber.com",
                    role: "gerenciamento"
                };
                await login(adminUser);
                navigate("/dashboard");
                return;
            }

            // 2. MODO CADASTRO DE NOVO CLIENTE
            if (isCadastro) {
                const novoCliente = {
                    nome: nome.trim() || inputUsuario.split("@")[0],
                    telefone: telefone.trim() || "(00) 00000-0000",
                    email: inputUsuario,
                    senha: senhaDigitada,
                    role: "cliente"
                };

                const resCriar = await api.post("/clientes", novoCliente);
                const usuarioCriado = resCriar.data || novoCliente;
                await login(usuarioCriado);
                
                navigate("/cliente/home");
                return;
            }

            // 3. MODO LOGIN DE CLIENTE NORMAL
            const resLogin = await api.post("/clientes/login", {
                email: inputUsuario,
                senha: senhaDigitada
            });

            await login(resLogin.data);
            navigate("/cliente/home");

        } catch (err) {
            console.error("Erro na autenticação:", err);

            if (err.response?.status === 401) {
                setErro("Senha incorreta! Por favor, tente novamente.");
            } else if (err.response?.status === 404) {
                setErro("Usuário/E-mail não encontrado. Clique em 'Criar Conta' para se cadastrar.");
            } else if (err.response?.data?.mensagem) {
                setErro(err.response.data.mensagem);
            } else {
                setErro("Falha ao conectar com o servidor. Verifique sua conexão.");
            }
        } finally {
            setCarregando(false);
        }
    };

    return (
        <div style={{ minHeight: "100vh", backgroundColor: "#0d0d0d", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem", color: "#fff", fontFamily: "sans-serif" }}>
            <div style={{ backgroundColor: "#161616", border: "1px solid #282828", borderRadius: "16px", padding: "2.5rem 2rem", width: "100%", maxWidth: "420px" }}>
                
                {/* Logo igual ao da Sidebar */}
                <div className="brand" style={{ display: "flex", justifyContent: "center", marginBottom: "0.5rem" }}>
                    <div style={{ textAlign: "center" }}>
                        <h2>BARBER</h2>
                        <span>PRO</span>
                    </div>
                </div>

                <p style={{ textAlign: "center", color: "#888", fontSize: "0.85rem", marginBottom: "1.5rem" }}>
                    {isCadastro ? "Crie sua conta de cliente" : "Acesse com seu usuário ou e-mail"}
                </p>

                {/* Abas Alternadoras */}
                <div style={{ display: "flex", marginBottom: "1.5rem", background: "#0d0d0d", borderRadius: "8px", padding: "4px" }}>
                    <button type="button" onClick={() => { setIsCadastro(false); setErro(""); }} style={{ flex: 1, padding: "8px", border: "none", background: !isCadastro ? "#d4af37" : "transparent", color: !isCadastro ? "#000" : "#888", fontWeight: "bold", borderRadius: "6px", cursor: "pointer" }}>Entrar</button>
                    <button type="button" onClick={() => { setIsCadastro(true); setErro(""); }} style={{ flex: 1, padding: "8px", border: "none", background: isCadastro ? "#d4af37" : "transparent", color: isCadastro ? "#000" : "#888", fontWeight: "bold", borderRadius: "6px", cursor: "pointer" }}>Criar Conta</button>
                </div>

                {erro && (
                    <div style={{ backgroundColor: "rgba(239, 68, 68, 0.2)", color: "#f87171", padding: "10px", borderRadius: "8px", fontSize: "0.85rem", marginBottom: "1rem", border: "1px solid rgba(239, 68, 68, 0.4)" }}>
                         {erro}
                    </div>
                )}

                {/* Formulário */}
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    

                    {isCadastro && (
                        <>
                            <div>
                                <label style={{ display: "block", fontSize: "0.85rem", color: "#aaa", marginBottom: "4px" }}>Nome Completo *</label>
                                <input type="text" required placeholder="Seu Nome" value={nome} onChange={(e) => setNome(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #333", background: "#222", color: "#fff", boxSizing: "border-box" }} />
                            </div>
                            <div>
                                <label style={{ display: "block", fontSize: "0.85rem", color: "#aaa", marginBottom: "4px" }}>Telefone / WhatsApp *</label>
                                <input type="tel" required placeholder="(11) 99999-9999" value={telefone} onChange={(e) => setTelefone(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #333", background: "#222", color: "#fff", boxSizing: "border-box" }} />
                            </div>
                        </>
                    )}

                    <div>
                        <label style={{ display: "block", fontSize: "0.85rem", color: "#aaa", marginBottom: "4px" }}>Usuário ou E-mail *</label>
                        <input type="text" required placeholder="seuemail@exemplo.com" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #333", background: "#222", color: "#fff", boxSizing: "border-box" }} />
                    </div>

                    <div>
                        <label style={{ display: "block", fontSize: "0.85rem", color: "#aaa", marginBottom: "4px" }}>Senha *</label>
                        <input type="password" required placeholder="••••••••" value={senha} onChange={(e) => setSenha(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #333", background: "#222", color: "#fff", boxSizing: "border-box" }} />
                    </div>

                    <button type="submit" disabled={carregando} style={{ marginTop: "1rem", width: "100%", padding: "12px", border: "none", background: "#d4af37", color: "#000", fontWeight: "bold", borderRadius: "8px", fontSize: "1rem", cursor: "pointer", opacity: carregando ? 0.6 : 1 }}>
                        {carregando ? "Carregando..." : isCadastro ? "Finalizar Cadastro" : "Entrar"}
                    </button>
                </form>

                {/* Rodapé igual ao da Sidebar */}
                <div style={{ textAlign: "center", marginTop: "2rem", paddingTop: "1rem", borderTop: "1px solid #282828", color: "#888", fontSize: "0.85rem" }}>
                    <span style={{ fontWeight: "bold", color: "#fff", display: "block" }}>BARBER PRO</span>
                    <small style={{ display: "block", color: "#666" }}>
                        Gestão da sua barbearia
                    </small>
                </div>

            </div>
        </div>
    );
}

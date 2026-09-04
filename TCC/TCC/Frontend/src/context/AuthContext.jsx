import { createContext, useState } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [usuario, setUsuario] = useState(() => {
        const salvo = localStorage.getItem("usuario");
        return salvo ? JSON.parse(salvo) : null;
    });

    const login = async (dados) => {
        setUsuario(dados);
        localStorage.setItem("usuario", JSON.stringify(dados));
    };

    const logout = () => {
        setUsuario(null);
        localStorage.removeItem("usuario");
        localStorage.removeItem("token");
    };

    return (
        <AuthContext.Provider value={{ usuario, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
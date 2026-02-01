"use client";

import { createContext, useContext, useEffect, useState } from "react";
import api, { setAuthToken } from "@/lib/api";

type User = {
    id: string;
    email: string;
};

type AuthContextType = {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType>(null!);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) setAuthToken(token);
    }, []);

    async function login(email: string, password: string) {
        const res = await api.post("/auth/login", { email, password });

        localStorage.setItem("token", res.data.token);
        setAuthToken(res.data.token);
        setUser(res.data.user);
    }

    function logout() {
        localStorage.removeItem("token");
        setAuthToken(null);
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
        {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}

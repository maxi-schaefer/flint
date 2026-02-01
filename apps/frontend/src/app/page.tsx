"use client";

import { LoginForm } from "@/components/app/login-form";
import { AuthProvider } from "@/providers/AuthProvider";

export default function Home() {
    return (
        <AuthProvider>
            <LoginForm />
        </AuthProvider>
    )
}
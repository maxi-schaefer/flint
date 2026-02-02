"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { AlertCircle, Eye, EyeOff, Loader2, Server } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useAuth } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";

export function LoginForm() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            await login(email, password);
            router.push("/dashboard")
        } catch (error) {
            setError("Invalid email or password")
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundImage: "url(/login.jpg)"}}>
            <div className="absolute inset-0 bg-black/50"/>
            

            <Card className="w-full max-w-md bg-background/85 backdrop-blur-sm animate-in fade-in zoom-in-95 duration-700">
                <CardHeader className="text-center flex justify-center border-b mx-4">
                    <img src="/logo.png" alt="logo" className="w-13 h-13" />
                    <div className="flex flex-col items-start">
                        <CardTitle className="text-2xl font-semibold text-foreground">Flint</CardTitle>
                        <CardDescription className="text-muted-foreground">Minecraft Server Management</CardDescription>
                    </div>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="flex items-center gap-2 p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg">
                                <AlertCircle className="h-4 w-4" />
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-foreground">Email</Label>
                            <Input id="email" type="email" placeholder="admin@flint.io" value={email} onChange={(e) => setEmail(e.target.value)} required className="bg-input border-border"/>
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="pr-10 bg-input border-border"
                                />
                                <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {
                                isLoading ? (<Loader2 className="h-4 w-4 animate-spin" />) : "Sign In"
                            }
                        </Button>

                        <div className="text-center text-xs text-muted-foreground">
                            Secure login • Flint © {new Date().getFullYear()}
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
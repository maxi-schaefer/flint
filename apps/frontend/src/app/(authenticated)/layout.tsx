"use client";

import { Sidebar } from "@/components/app/sidebar";
import React from "react";

export default function AuthLayout({
  children
}: Readonly<{ children: React.ReactNode}>) {
  return (
    <div className="flex h-screen bg-background">
        <Sidebar />
        <main className="flex-1 overflow-auto">
            {children}
        </main>
    </div>
  )
} 
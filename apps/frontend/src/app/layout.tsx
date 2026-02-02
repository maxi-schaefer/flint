import React from "react";
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { AuthProvider } from "@/providers/AuthProvider";
import { Metadata } from "next";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Flint - Minecraft Server Management`,
  };
}

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode}>) {
  return (
    <html lang="en">
      <AuthProvider>
        <body className="font-sans antialiased">
          {children}
        </body>
      </AuthProvider>
    </html>
  )
} 
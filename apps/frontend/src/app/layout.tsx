import React from "react";
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { ServerStoreProvider } from "@/context/ServerStoreContext";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode}>) {
  return (
    <html lang="en">
      <ServerStoreProvider>
        <body className="font-sans antialiased">
          {children}
        </body>
      </ServerStoreProvider>
    </html>
  )
} 
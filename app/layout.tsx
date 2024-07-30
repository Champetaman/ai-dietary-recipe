import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Recetario Inteligente",
  description:
    "Recetario Inteligente es una aplicación web que sugiere recetas en función de parámetros seleccionados por el usuario, como la hora del día, el tipo de comida, las restricciones dietéticas y la dieta religiosa.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}

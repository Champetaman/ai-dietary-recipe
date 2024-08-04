import { Analytics } from "@vercel/analytics/react"; // Importing Vercel Analytics for tracking user interactions
import type { Metadata } from "next"; // Importing Metadata type for defining page metadata
import { Inter } from "next/font/google"; // Importing Google Fonts
import "./globals.css"; // Importing global CSS styles
import Head from "next/head"; // Importing Head for managing <head> content

// Load the Inter font from Google Fonts with Latin subset support
const inter = Inter({ subsets: ["latin"] });

// Define metadata for the application
export const metadata: Metadata = {
  title: "Recetario Inteligente", // Title of the application
  description:
    "Recetario Inteligente es una aplicación web que sugiere recetas en función de parámetros seleccionados por el usuario, como la hora del día, el tipo de comida, las restricciones dietéticas y la dieta religiosa.", // Description of the application
  icons: {
    icon: "/favicon.ico",
  },
};

// RootLayout component definition
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode; // The children components to be rendered within the layout
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        {/* Render child components */}
        {children}
        {/* Include Vercel Analytics for tracking user interactions */}
        <Analytics />
      </body>
    </html>
  );
}

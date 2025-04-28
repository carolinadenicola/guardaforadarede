import type { Metadata } from "next";
import { Inter, Karla } from "next/font/google";
import "./globals.css";

const karla = Karla({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Guarda de material",
  description: "Sistema para acompanhar itens pela fábrica depois do recebimento",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="pt">
        <body className={karla.className}>{children}</body>
    </html>
  );
}

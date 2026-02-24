import "./globals.css";
import type { Metadata } from "next";
import { SessionProvider } from "@/components/session-provider";

export const metadata: Metadata = {
  title: "Portal + Livro + Árvore",
  description: "Portal genealógico privado multi-tenant"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}

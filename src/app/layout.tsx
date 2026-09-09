import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FozGo Admin — Painel de conteúdo",
  description:
    "Painel administrativo para gerenciar locais, categorias, roteiros e avaliações do app FozGo.",
};

const themeScript = `(function(){try{var t=localStorage.getItem('fozgo-theme');if(t==='dark'){document.documentElement.classList.add('dark');}}catch(e){}})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}

import React from 'react';

// Este é um layout simples que apenas passa os "filhos" (a página) adiante.
// Note que NÃO HÁ <html> ou <body> tags aqui.
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      {children}
    </section>
  );
}
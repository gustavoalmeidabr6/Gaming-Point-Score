// Caminho: frontend/app/layout.tsx
import './globals.css';
import { Inter, Jersey_25 } from 'next/font/google';

// Carrega as fontes
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter', // Variável CSS para o corpo do texto
});

const jersey = Jersey_25({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-jersey', // Variável CSS para os títulos
});

export const metadata = {
  title: 'GameG Score',
  description: 'Seu perfil gamer, completo e profissional',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      {/* Aplica as variáveis da fonte ao body.
        'bg-black' define o fundo preto padrão
      */}
      <body className={`${inter.variable} ${jersey.variable} bg-black text-white`}>
        {children}
      </body>
    </html>
  );
}
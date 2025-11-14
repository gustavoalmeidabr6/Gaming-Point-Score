// Caminho: frontend/app/layout.tsx
import './globals.css';
// 1. MUDÁMOS DE 'Jersey_25' PARA 'Silkscreen'
import { Inter, Silkscreen } from 'next/font/google';

// Configuração da fonte Inter (para os balões)
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter', 
});

// 2. CONFIGURÁMOS A NOVA FONTE PIXELADA
const pixel = Silkscreen({
  subsets: ['latin'],
  weight: ['400', '700'], // Carregamos o peso normal e o negrito
  variable: '--font-pixel', // Demos-lhe o apelido de 'pixel'
});

export const metadata = {
  title: 'Gaming Point',
  description: 'Seu perfil gamer definitivo',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      {/* 3. ADICIONÁMOS A NOVA FONTE AO BODY */}
      <body className={`${inter.variable} ${pixel.variable} bg-black text-white font-sans`}>
        {children}
      </body>
    </html>
  );
}
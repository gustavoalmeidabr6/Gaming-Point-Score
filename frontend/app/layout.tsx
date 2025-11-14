// Caminho: frontend/app/layout.tsx
import './globals.css'; // Importa o Tailwind

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
      <body className="bg-black text-white">
        {children}
      </body>
    </html>
  );
}
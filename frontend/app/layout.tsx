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
      {/* A MUDANÇA ESTÁ AQUI: 
        Removemos o 'style={{...}}'
        e aplicamos as classes do Tailwind 'bg-gray-900' e 'text-white'
        diretamente no body.
      */}
      <body className="bg-gray-900 text-white">
        {children}
      </body>
    </html>
  );
}
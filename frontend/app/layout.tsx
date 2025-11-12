import './globals.css'; // O Next.js cria isso - pode deixar

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
      <body style={{ margin: 0, backgroundColor: '#121212' }}>
        {children}
      </body>
    </html>
  );
}
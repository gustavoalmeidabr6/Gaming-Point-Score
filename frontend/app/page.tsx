'use client';

// No futuro, podemos usar a função 'useRouter' para navegar
// import { useRouter } from 'next/navigation';

export default function WelcomePage() {
  // const router = useRouter(); // Para o botão funcionar

  const handleLoginClick = () => {
    // No futuro, isso levaria para a página de login
    // router.push('/login');
    alert('Função de Login ainda não implementada!');
  };

  const handleRegisterClick = () => {
    // Isso nos levaria para a nossa tela principal
    // Por enquanto, vamos usar um link normal
  };

  return (
    <main style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: '#121212', // Fundo escuro
      fontFamily: 'sans-serif'
    }}>

      {/* Aqui entraria sua imagem de personagens */}
      <div style={{ padding: '40px', backgroundColor: '#1a1a1a', borderRadius: '10px', textAlign: 'center' }}>
        
        <h1 style={{ color: 'white', fontSize: '48px', margin: 0 }}>
          Bem-vindo ao <span style={{ color: 'lime' }}>Gaming Point</span>
        </h1>
        
        <p style={{ color: '#ccc', fontSize: '20px', marginTop: '10px' }}>
          Organize, avalie e exiba sua jornada gamer para o mundo.
        </p>

        {/* Balões de Funcionalidades (Simplificado) */}
        <div style={{ margin: '30px 0', display: 'flex', justifyContent: 'center', gap: '15px' }}>
          <span style={{ backgroundColor: '#333', color: 'white', padding: '10px 15px', borderRadius: '20px' }}>
            Acompanhe seus jogos
          </span>
          <span style={{ backgroundColor: '#333', color: 'white', padding: '10px 15px', borderRadius: '20px' }}>
            Crie seu perfil
          </span>
          <span style={{ backgroundColor: '#333', color: 'white', padding: '10px 15px', borderRadius: '20px' }}>
            Veja estatísticas
          </span>
        </div>

        {/* Botões de Ação */}
        <div style={{ marginTop: '20px' }}>
          {/* O Next.js usa <Link> para navegação. Por enquanto, usaremos um <a> */}
          <a 
            href="/dashboard" 
            style={{ 
              fontSize: '18px', 
              padding: '15px 30px', 
              backgroundColor: 'lime', 
              color: 'black', 
              textDecoration: 'none',
              fontWeight: 'bold',
              borderRadius: '5px'
            }}
          S>
            Começar (Ir para o App)
          </a>
        </div>

      </div>

    </main>
  );
}
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
    // Aplicando classes do Tailwind:
    // min-h-screen: Altura mínima da tela inteira
    // bg-gray-900: Cor de fundo escura
    // text-white: Cor do texto padrão
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-900 p-8 font-sans">
      
      <div className="w-full max-w-xl rounded-lg bg-gray-800 p-10 text-center">
        
        <h1 className="m-0 text-5xl font-bold text-white">
          Bem-vindo ao <span className="text-lime-400">Gaming Point</span>
        </h1>
        
        <p className="mt-2 text-xl text-gray-400">
          Organize, avalie e exiba sua jornada gamer para o mundo.
        </p>

        {/* Balões de Funcionalidades */}
        <div className="my-8 flex justify-center gap-4">
          <span className="rounded-full bg-gray-700 px-4 py-2 text-sm text-white">
            Acompanhe seus jogos
          </span>
          <span className="rounded-full bg-gray-700 px-4 py-2 text-sm text-white">
            Crie seu perfil
          </span>
          <span className="rounded-full bg-gray-700 px-4 py-2 text-sm text-white">
            Veja estatísticas
          </span>
        </div>

        {/* Botões de Ação */}
        <div>
          <a 
            href="/dashboard" 
            className="rounded-md bg-lime-400 px-8 py-4 text-lg font-bold text-black no-underline transition-all hover:bg-lime-300"
          >
            Começar (Ir para o App)
          </a>
        </div>

      </div>

    </main>
  );
}
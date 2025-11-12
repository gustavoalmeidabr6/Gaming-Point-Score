'use client';

// Importa o componente de Imagem do Next.js para otimização
import Image from 'next/image';

// Importa o componente de Link do Next.js para navegação
import Link from 'next/link';

export default function WelcomePage() {
  return (
    // Container principal:
    // - Ocupa a tela inteira (min-h-screen)
    // - Usa flexbox para centralizar tudo (flex, items-center, justify-center)
    // - Fundo escuro (bg-gray-900)
    // - 'relative' é OBRIGATÓRIO para que os balões 'absolute' fiquem dentro dele
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gray-900 p-8 font-sans">
      
      {/* 1. A IMAGEM DE FUNDO 
        Use o componente <Image> do Next.js.
        - 'layout="fill"' faz a imagem preencher o container pai (o <main>)
        - 'object-cover' garante que a imagem cubra tudo sem distorcer
        - 'opacity-50' deixa ela mais escura para os textos aparecerem
        - 'z-0' coloca ela no fundo
      */}
      
      {/* !!! IMPORTANTE !!!
        Substitua "/caminho-para-sua-imagem.jpg" 
        pelo caminho da sua imagem dentro da pasta /public
        Ex: Se a imagem for "public/images/personagens.png", use "/images/personagens.png"
      */}
      <Image
        src="/images/personagens.png" // !!! TROQUE ESTE CAMINHO !!!
        alt="Personagens de Jogos"
        layout="fill"
        objectFit="cover"
        className="z-0 opacity-40"
      />

      {/* Container para o conteúdo (botão e balões)
        - 'z-10' coloca este container NA FRENTE da imagem de fundo
        - 'relative' é necessário para que os balões se posicionem dentro dele
      */}
      <div className="relative z-10 w-full max-w-4xl text-center">
        
        {/* Título (como você tinha, mas maior) */}
        <h1 className="text-6xl font-bold text-white drop-shadow-lg">
          Bem-vindo ao <span className="text-lime-400">Gaming Point</span>
        </h1>
        <p className="mt-4 text-2xl text-gray-200 drop-shadow-md">
          Organize, avalie e exiba sua jornada gamer para o mundo.
        </p>

        {/* 2. OS BALÕES DE FUNCIONALIDADE
          Usamos 'absolute' do Tailwind para posicionar.
          Usamos as classes 'balloon' e 'balloon-top'/'balloon-bottom' 
          que criámos no globals.css.
        */}

        {/* Balão 1 */}
        <div className="balloon balloon-bottom" style={{ top: '10%', left: '5%' }}>
          <p>Avalie seus jogos em 5 tópicos detalhados!</p>
        </div>

        {/* Balão 2 */}
        <div className="balloon balloon-top" style={{ top: '30%', right: '10%' }}>
          <p>Crie seu perfil e compartilhe suas conquistas!</p>
        </div>

        {/* Balão 3 */}
        <div className="balloon balloon-bottom" style={{ top: '60%', left: '20%' }}>
          <p>Descubra novos jogos no nosso catálogo!</p>
        </div>

        {/* 3. O BOTÃO DE CADASTRO / COMEÇAR
          Usamos 'absolute' para posicionar no fundo.
          Reutilizei o seu estilo 'bg-lime-400'.
        */}
        <div className="absolute -bottom-40 left-1/2 -translate-x-1/2 transform">
          <Link 
            href="/dashboard" 
            className="rounded-full bg-lime-400 px-10 py-5 text-2xl font-bold text-black no-underline shadow-lg transition-all hover:bg-lime-300 hover:scale-105"
          >
            Criar minha conta
          </Link>
        </div>

      </div>
    </main>
  );
}
// Caminho: frontend/app/page.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link'; // Importa o Link para navegação

// O seu componente de botão. Está ótimo! 
// A única mudança foi trocar font-['Inter'] para 'font-sans' (que agora é Inter)
function NavigationButton({ children }: { children: React.ReactNode }) {
  return (
    <div className="
      backdrop-blur-[21px] backdrop-filter rounded-[30px] 
      bg-[#2B2B2B]/70 px-8 py-8 transition-all duration-300 
      hover:bg-gradient-to-b hover:from-[#7CFC00] hover:to-[#6BE000] 
      cursor-pointer group">
      <div className="font-sans group-hover:text-black transition-colors duration-300 text-white whitespace-pre-line text-center text-lg">
        {children}
      </div>
    </div>
  );
}

export default function WelcomePage() {
  return (
    // Layout principal: Ocupa o ecrã todo, fundo preto
    <div className="relative min-h-screen w-full overflow-hidden bg-black">
      
      {/* --- O FUNDO CORRIGIDO --- 
        Uma única imagem que cobre tudo (object-cover)
        e fica no fundo (z-0)
      */}
      <Image
        alt="Personagens de fundo"
        src="/images/welcome-bg.jpg" // O seu fundo completo exportado
        layout="fill"
        objectFit="cover" // Garante que cobre tudo sem distorcer
        className="z-0 opacity-50" // Opacidade para não ser tão forte
      />
      
      {/* --- O CONTEÚDO CORRIGIDO ---
        'relative z-10' para ficar na frente do fundo.
        'grid-cols-1 lg:grid-cols-2' (responsivo!)
      */}
      <div className="relative z-10 flex h-full min-h-screen items-center justify-center px-8 lg:px-20">
        <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Coluna Esquerda (Logo e Balões) */}
          <div className="flex flex-col gap-8">
            {/* Logo */}
            <div className="flex flex-col gap-2">
              <Image
                alt="GameG Score Logo"
                src="/images/logo.png" // O seu logo exportado
                width={420}
                height={200}
                className="h-auto w-full max-w-[420px]"
              />
              <p className="font-jersey text-white text-2xl tracking-wide ml-1">
                Seu perfil gamer, completo e profissional
              </p>
            </div>
            
            {/* Botões de Navegação (Balões) */}
            <div className="grid grid-cols-2 gap-4">
              <NavigationButton>
                Avalie seus jogos
              </NavigationButton>
              <NavigationButton>
                Aprimore seu perfil
              </NavigationButton>
              <NavigationButton>
                Acompanhe suas{'\n'}estatísticas
              </NavigationButton>
              <NavigationButton>
                Salve todos os{'\n'}seus jogos
              </NavigationButton>
            </div>
          </div>
          
          {/* Coluna Direita (Vídeo e Botões CTA) */}
          <div className="flex flex-col items-center gap-10">
            {/* Onde estava a imagem, agora é um VÍDEO */}
            <div className="w-full max-w-[500px] rounded-[20px] overflow-hidden border-[6px] border-[#3bbe5d] shadow-[0px_0px_30px_rgba(59,190,93,0.3)]">
              <video 
                src="/videos/gameplay.mp4" // O seu vídeo
                className="w-full h-auto"
                autoPlay 
                loop 
                muted 
                playsInline
              />
            </div>
            
            {/* Botões de Ação (Login/Cadastro) */}
            {/* Usando <Link> para "Juntar com o backend" (navegação) */}
            <div className="flex flex-col sm:flex-row gap-8 justify-center">
              
              <Link href="/login" className="
                bg-gradient-to-b from-[#0d0d0d] to-[#085400] rounded-full px-10 py-3 
                shadow-[0px_4px_14.7px_5px_rgba(73,255,12,0.25)] 
                hover:shadow-[0px_4px_20px_8px_rgba(73,255,12,0.4)] 
                transition-all duration-300 hover:scale-105 border border-black">
                <span className="font-jersey text-white text-[28px] tracking-tight">
                  Crie sua conta
                </span>
              </Link>
              
              <Link href="/login" className="
                bg-gradient-to-b from-[#0d0d0d] to-[#085400] rounded-full px-14 py-3 
                shadow-[0px_4px_14.7px_5px_rgba(73,255,12,0.25)] 
                hover:shadow-[0px_4px_20px_8px_rgba(73,255,12,0.4)] 
                transition-all duration-300 hover:scale-105 border border-black">
                <span className="font-jersey text-white text-[28px] tracking-tight">
                  Login
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
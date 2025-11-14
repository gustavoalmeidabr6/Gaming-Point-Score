// Caminho: frontend/app/page.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link'; 

// Balões (com o hover verde a funcionar)
function NavigationButton({ children }: { children: React.ReactNode }) {
  return (
    <div className="
      backdrop-blur-md backdrop-filter rounded-[30px] 
      
      bg-gradient-to-b from-lime-green/15 to-black/75
      
      border border-lime-green/30
      shadow-[0px_0px_20px_rgba(59,190,93,0.25)]
      h-20 px-4 flex items-center justify-center 
      transition-all duration-300 
      
      hover:bg-lime-green hover:text-black
      hover:shadow-lime-green/50

      cursor-pointer group">
      
      <div className="font-sans font-semibold text-white group-hover:text-black whitespace-pre-line text-center text-lg">
        {children}
      </div>
    </div>
  );
}


export default function WelcomePage() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black">
      
      {/* --- FUNDO (Opacidade 85%) --- */}
      <Image
        alt="Personagens de fundo"
        src="/images/welcome-bg.jpg" //
        layout="fill"
        objectFit="cover" 
        className="z-0 opacity-85"
      />
      
      {/* --- CONTEÚDO (ALINHAMENTO COM FLEX) --- */}
      <div className="relative z-10 flex h-full min-h-screen w-full items-center justify-center px-5 lg:px-20">
        
        <div className="w-full max-w-7xl flex flex-col lg:flex-row justify-center items-center gap-12 lg:gap-16">
          
          {/* Coluna Esquerda */}
          <div className="flex flex-col gap-6 w-full max-w-[420px]">
            <Image
              alt="GameG Score Logo"
              src="/images/logo.png" //
              width={420}
              height={200}
              className="h-auto w-full max-w-[460px]"
            />
            <p className="font-pixel text-white text-x2 tracking-wide text-center">
              Construa seu perfil gamer e salve e avalie os jogos que voce jogou
            </p>
            
            <div className="grid grid-cols-2 gap-5">
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
          
          {/* Coluna Direita (Vídeo com 700px) */}
          <div className="flex flex-col items-center gap-8 w-full max-w-[700px]">
            
            <div className="w-full rounded-[20px] overflow-hidden border-[6px] border-lime-green shadow-[0px_0px_30px_rgba(59,190,93,0.3)]">
              <video 
                src="/videos/gameplay.mp4"
                className="w-full h-auto"
                autoPlay 
                loop 
                muted 
                playsInline
              />
            </div>
            
            {/* Botões de Ação */}
            <div className="flex flex-col sm:flex-row gap-8 justify-center">
              
              {/* --- MUDANÇA #1: text-black para text-white --- */}
              <Link href="/login" className="
                bg-lime-green rounded-full px-10 py-3 text-white font-pixel font-bold text-xl tracking-wide
                shadow-[0px_4px_14.7px_5px_rgba(73,255,12,0.25)] 
                hover:shadow-[0px_4px_20px_8px_rgba(73,255,12,0.4)] 
                transition-all duration-300 hover:scale-105 border border-black">
                  Crie sua conta
              </Link>
              
              {/* --- MUDANÇA #2: text-black para text-white --- */}
              <Link href="/login" className="
                bg-lime-green rounded-full px-14 py-3 text-white font-pixel font-bold text-xl tracking-wide
                shadow-[0px_4px_14.7px_5px_rgba(73,255,12,0.25)] 
                hover:shadow-[0px_4px_20px_8px_rgba(73,255,12,0.4)] 
                transition-all duration-300 hover:scale-105 border border-black">
                  Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
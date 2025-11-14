// Caminho: frontend/app/page.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link'; 

// --- CÓDIGO CORRIGIDO ---
// Removi os comentários '//' de dentro do className
function NavigationButton({ children }: { children: React.ReactNode }) {
  return (
    <div className="
      backdrop-blur-md backdrop-filter rounded-[30px] 
      
      bg-gray-900/70
      border border-lime-green/30
      shadow-[0px_0px_20px_rgba(59,190,93,0.25)]

      h-20 px-4 flex items-center justify-center 
      transition-all duration-300 
      
      hover:bg-lime-green hover:text-black
      hover:shadow-lime-green/50

      cursor-pointer group">
      
      <div className="font-sans transition-colors duration-300 text-white group-hover:text-black whitespace-pre-line text-center text-lg">
        {children}
      </div>
    </div>
  );
}
// --- FIM DA CORREÇÃO ---


export default function WelcomePage() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black">
      
      {/* --- FUNDO (NÃO MEXI, COMO PEDIDO) --- */}
      <Image
        alt="Personagens de fundo"
        src="/images/welcome-bg.jpg" //
        layout="fill"
        objectFit="cover" 
        className="z-0 opacity-65"
      />
      
      {/* --- CONTEÚDO (NA FRENTE) --- */}
      <div className="relative z-10 flex h-full min-h-screen items-center justify-center px-5 lg:px-20">
        
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Coluna Esquerda */}
          <div className="flex flex-col gap-4 w-full max-w-[420px] lg:justify-self-end">
            <Image
              alt="GameG Score Logo"
              src="/images/logo.png" //
              width={420}
              height={200}
              className="h-auto w-full max-w-[420px]"
            />
            <p className="font-jersey text-white text-[22px] tracking-wide ml-1">
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
          
          {/* Coluna Direita */}
          <div className="flex flex-col items-center gap-8 w-full lg:justify-self-start">
            
            <div className="w-full max-w-[650px] rounded-[20px] overflow-hidden border-[6px] border-lime-green shadow-[0px_0px_30px_rgba(59,190,93,0.3)]">
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
              
              <Link href="/login" className="
                bg-lime-green rounded-full px-10 py-2 text-black font-jersey text-[24px] tracking-wide
                shadow-[0px_4px_14.7px_5px_rgba(73,255,12,0.25)] 
                hover:shadow-[0px_4px_20px_8px_rgba(73,255,12,0.4)] 
                transition-all duration-300 hover:scale-105 border border-black">
                  Crie sua conta
              </Link>
              
              <Link href="/login" className="
                bg-lime-green rounded-full px-14 py-2 text-black font-jersey text-[24px] tracking-wide
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
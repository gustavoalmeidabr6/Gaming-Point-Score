// Caminho: frontend/app/page.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link'; 

// Componente do Balão (baseado no código do Figma)
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
    <div className="relative min-h-screen w-full overflow-hidden bg-black">
      
      {/* --- FUNDO --- */}
      <Image
        alt="Personagens de fundo"
        src="/images/welcome-bg.jpg" // TEM DE TER ESTE NOME E ESTAR EM /public/images/
        layout="fill"
        objectFit="cover" 
        className="z-0 opacity-50"
      />
      
      {/* --- CONTEÚDO --- */}
      <div className="relative z-10 flex h-full min-h-screen items-center justify-center px-8 lg:px-20">
        <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Coluna Esquerda */}
          <div className="flex flex-col gap-8">
            <Image
              alt="GameG Score Logo"
              src="/images/logo.png" // TEM DE TER ESTE NOME E ESTAR EM /public/images/
              width={420}
              height={200}
              className="h-auto w-full max-w-[420px]"
            />
            <p className="font-sans text-white text-2xl tracking-wide ml-1">
              Seu perfil gamer, completo e profissional
            </p>
            
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
          
          {/* Coluna Direita */}
          <div className="flex flex-col items-center gap-10">
            <div className="w-full max-w-[500px] rounded-[20px] overflow-hidden border-[6px] border-[#3bbe5d] shadow-[0px_0px_30px_rgba(59,190,93,0.3)]">
              <video 
                src="/videos/gameplay.mp4" // TEM DE TER ESTE NOME E ESTAR EM /public/videos/
                className="w-full h-auto"
                autoPlay 
                loop 
                muted 
                playsInline
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-8 justify-center">
              <Link href="/login" className="
                bg-gradient-to-b from-[#0d0d0d] to-[#085400] rounded-full px-10 py-3 
                shadow-[0px_4px_14.7px_5px_rgba(73,255,12,0.25)] 
                hover:shadow-[0px_4px_20px_8px_rgba(73,255,12,0.4)] 
                transition-all duration-300 hover:scale-105 border border-black">
                <span className="font-sans text-white text-[28px] tracking-tight">
                  Crie sua conta
                </span>
              </Link>
              
              <Link href="/login" className="
                bg-gradient-to-b from-[#0d0d0d] to-[#085400] rounded-full px-14 py-3 
                shadow-[0px_4px_14.7px_5px_rgba(73,255,12,0.25)] 
                hover:shadow-[0px_4px_20px_8px_rgba(73,255,12,0.4)] 
                transition-all duration-300 hover:scale-105 border border-black">
                <span className="font-sans text-white text-[28px] tracking-tight">
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
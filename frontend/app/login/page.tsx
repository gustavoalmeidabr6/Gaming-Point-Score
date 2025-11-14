// Caminho do arquivo: frontend/app/login/page.tsx
'use client'; 

import Link from 'next/link';
import Image from 'next/image'; 

export default function LoginPage() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black">
      
      {/* --- MUDANÇA AQUI --- */}
      <Image
        alt="Fundo da página de login"
        src="/images/login-bg.png" // 1. Use a sua nova imagem
        layout="fill"
        objectFit="cover" 
        className="z-0 opacity-65" // Mantive a opacidade (pode ajustar se quiser)
      />
      {/* --- FIM DA MUDANÇA --- */}
      
      <main className="relative z-10 flex min-h-screen flex-col items-center justify-center p-8">
        
        <Link href="/">
          <Image
            alt="GameG Score Logo"
            src="/images/logo.png" //
            width={300}
            height={143}
            className="h-auto w-full max-w-[300px] mb-8"
          />
        </Link>
        
        <div className="
          w-full max-w-md rounded-[30px] p-8 
          backdrop-blur-md backdrop-filter 
          bg-gradient-to-b from-lime-green/10 to-black/75
          border border-lime-green/30
          shadow-[0px_0px_20px_rgba(59,190,93,0.25)]
        ">
          
          <h1 className="mb-6 text-center text-4xl font-pixel font-bold text-white">
            Login
          </h1>
          
          <form>
            <div className="mb-4">
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-300 font-sans">
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="seu.email@exemplo.com"
                className="w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-500 focus:border-lime-400 focus:outline-none focus:ring-lime-400 font-sans"
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-300 font-sans">
                Senha
              </label>
              <input
                type="password"
                id="password"
                placeholder="••••••••"
                className="w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-500 focus:border-lime-400 focus:outline-none focus:ring-lime-400 font-sans"
              />
            </div>

            <Link 
              href="/dashboard" 
              className="
                block w-full rounded-full bg-lime-green px-8 py-3 
                text-center text-white font-pixel font-bold text-xl tracking-wide no-underline 
                transition-all duration-300 hover:scale-105 border border-black
                shadow-[0px_4px_14.7px_5px_rgba(73,255,12,0.25)] 
                hover:shadow-[0px_4px_20px_8px_rgba(73,255,12,0.4)]
              "
            >
              Entrar (Temporário)
            </Link>
          </form>

          <p className="mt-6 text-center text-sm text-gray-400 font-sans">
            Não tem uma conta?{' '}
            <Link href="/" className="font-medium text-lime-400 hover:text-lime-300">
              Crie uma aqui
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
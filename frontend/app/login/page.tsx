// Caminho do arquivo: frontend/app/login/page.tsx
'use client'; 

import Link from 'next/link';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-900 p-8">
      
      {/* Caixa do Formulário */}
      <div className="w-full max-w-md rounded-lg bg-gray-800 p-8 shadow-lg">
        
        <h1 className="mb-6 text-center text-3xl font-bold text-white">
          Login
        </h1>
        
        {/* Formulário Falso (por enquanto) */}
        <form>
          {/* Campo Email */}
          <div className="mb-4">
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-300">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="seu.email@exemplo.com"
              // Classes do Tailwind para estilizar o input
              className="w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-500 focus:border-lime-400 focus:outline-none focus:ring-lime-400"
            />
          </div>
          
          {/* Campo Senha */}
          <div className="mb-6">
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-300">
              Senha
            </label>
            <input
              type="password"
              id="password"
              placeholder="••••••••"
              className="w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-500 focus:border-lime-400 focus:outline-none focus:ring-lime-400"
            />
          </div>

          {/* Botão de Entrar (Leva para o Dashboard) */}
          <Link 
            href="/dashboard" 
            className="block w-full rounded-md bg-lime-400 px-8 py-3 text-center text-lg font-bold text-black no-underline transition-all hover:bg-lime-300"
          >
            Entrar (Temporário)
          </Link>
        </form>

        {/* Link para Cadastro (volta para a Welcome Page) */}
        <p className="mt-6 text-center text-sm text-gray-400">
          Não tem uma conta?{' '}
          <Link href="/" className="font-medium text-lime-400 hover:text-lime-300">
            Crie uma aqui
          </Link>
        </p>
      </div>
    </main>
  );
}
// Caminho do arquivo: frontend/app/dashboard/page.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';

// --- COMPONENTE DO HEADER (COM AS SUAS ALTERAÇÕES) ---
function DashboardHeader() {
  return (
    <header className="relative w-full h-64"> 
      
      <Image
        src="/images/dashboard-banner.jpg" //
        alt="Banner do perfil"
        fill
        className="object-cover z-0"
      />
      
      <div className="absolute z-20 inset-0 flex items-center justify-center pt-40">
        
        {/* O seu pod de 600px */}
        <div className="relative w-[600px] h-[140px]">
          
          {/* CAMADA 1: O AVATAR (z-20 - Fica atrás) */}
          <div className="
            absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
            w-[100px] h-[100px] rounded-full z-20 
          ">
            <Image 
              src="/images/placeholder-avatar.jpg" //
              alt="Foto de Perfil"
              width={110} 
              height={110}
              className="rounded-full object-cover"
            />
          </div>

          {/* CAMADA 2: A IMAGEM-BASE DO POD (z-30 - Fica na frente) */}
          <Image
            src="/images/pod-background.png" //
            alt="Fundo do perfil"
            fill
            objectFit="contain"
            className="z-30"
          />

          {/* CAMADA 3: O TEXTO (z-40 - Fica na frente de tudo) */}
          <div className="absolute inset-0 z-40">
            
            <div className="absolute left-[3.5rem] top-1/2 -translate-y-1/2 flex items-center gap-3">
              <div className="
                flex h-12 w-12 items-center justify-center 
                rounded-md bg-lime-900/50 font-pixel text-lg font-bold text-lime-300
                border border-lime-700
              ">
                B2
              </div>
              <div>
                <h2 className="font-pixel text-lg font-bold text-white">BRONZE II</h2>
                <p className="font-sans text-xs text-gray-400">Próximo nível: 208 XP</p>
              </div>
            </div>

            <div className="absolute right-[5.5rem] top-1/2 -translate-y-1/2">
              <h1 className="font-pixel text-3xl font-bold text-white">
                NOME
              </h1>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}


// --- PÁGINA PRINCIPAL DO DASHBOARD ---
export default function DashboardPage() {
  const [query, setQuery] = useState(''); 
  const [isSearchLoading, setIsSearchLoading] = useState(false);

  const handleSearch = async () => {
    if (!query) return;
    setIsSearchLoading(true);
    console.log("Buscando por:", query);
    setIsSearchLoading(false);
  };

  return (
    // Divisão #1 (Área da Pesquisa)
    <main className="min-h-screen bg-[#1E2024] text-white">
      
      <DashboardHeader />
      
      {/* --- MUDANÇA #1: O "RETANGULO" COM TRAÇADO CINZA ---
          Adicionei o 'border-b border-gray-700' que você pediu
      */}
      <div className="w-full bg-[#1E2024] border-b border-gray-700">
        <div className="mx-auto max-w-8xl px-4 pt-10 pb-10 sm:px-6 lg:px-10">
          <div className="flex items-center gap-0">
            
            <button className="
              p-2 rounded-md text-white
              hover:bg-white/10 transition-colors
            ">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
            
            <section className="flex-grow max-w-lg mx-auto">
              <div className="relative">
                {/* --- MUDANÇA #2: O BUG 'e.g.value' FOI CORRIGIDO --- */}
                <input 
                  type="text" 
                  value={query} 
                  onChange={(e) => setQuery(e.target.value)} 
                  placeholder="PESQUISAR JOGOS..." 
                  className="
                    w-full rounded-full 
                    border border-gray-700
                    bg-[#2A2D32] px-6 py-3 
                    font-pixel tracking-wider text-white placeholder-gray-500
                    focus:border-lime-400 focus:outline-none focus:ring-1 focus:ring-lime-400"
                  // --- MUDANÇA #3: Borda verde trocada para 'border-gray-700' ---
                />
                <button 
                  onClick={handleSearch}
                  className="absolute right-2 top-1/2 -translate-y-1/2
                    rounded-full bg-lime-400 p-2.5
                    text-black transition-all hover:bg-lime-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                  </svg>
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
      
      {/* Divisão #2 (Jogos) */}
      <div className="w-full bg-gray-900">
        <div className="mx-auto max-w-6xl px-4 pt-10 pb-20 sm:px-6 lg:px-8">
          
          <div className="h-px bg-gray-600/50 my-10 border-none"></div>

          <section>
            <h2 className="mb-6 text-3xl font-bold text-white font-pixel tracking-wider">
              JOGOS RELEVANTES
            </h2>
            <div className="grid grid-cols-4 gap-8 md:grid-cols-4">
              {[...Array(8)].map((_, i) => (
                <div 
                  key={i} 
                  className="
                    cursor-pointer rounded-xl bg-[#2A2D32] shadow-lg 
                    border border-gray-700/50
                    transition-all duration-300 hover:border-lime-400/50 hover:scale-105
                  "
                >
                  <div className="aspect-[4/3] w-full rounded-t-xl bg-[#393D44] flex items-center justify-center">
                  </div>
                  <h3 className="p-3 font-sans text-sm font-semibold text-white truncate">
                    Dragon's Crest: Age of Valor
                  </h3>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
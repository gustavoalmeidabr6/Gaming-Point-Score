// Caminho do arquivo: frontend/app/dashboard/page.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';

// --- COMPONENTE DO HEADER (O seu código, sem mudanças) ---
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
        
        <div className="relative w-[600px] h-[140px]">
          
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

          <Image
            src="/images/pod-background.png" //
            alt="Fundo do perfil"
            fill
            objectFit="contain"
            className="z-30"
          />

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

// --- MUDANÇA #1: TIPO (Adicionámos medium_url) ---
type GameSearchResult = {
  id: number;
  name: string;
  image: { 
    thumb_url: string | null;
    medium_url: string | null; // Pedimos a imagem de qualidade média
  };
};


// --- PÁGINA PRINCIPAL DO DASHBOARD ---
export default function DashboardPage() {
  const [query, setQuery] = useState(''); 
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [results, setResults] = useState<GameSearchResult[]>([]);

  // --- MUDANÇA #2: FUNÇÃO 'wrapper' para o formulário ---
  // Isto previne o recarregamento da página quando damos "Enter"
  const handleSearchWrapper = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Impede o recarregamento da página
    handleSearch();     // Chama a sua função de busca
  };

  // Esta é a sua função de busca (sem mudanças)
  const handleSearch = async () => {
    if (!query) return; 
    setIsSearchLoading(true);
    setResults([]); 
    
    try {
      const response = await fetch(`/api/search?q=${query}`);
      const data = await response.json();
      if (Array.isArray(data)) {
        setResults(data);
      } else {
        console.error("A API não retornou um array:", data);
      }
    } catch (error) {
      console.error("Erro ao buscar dados da API:", error);
    }
    setIsSearchLoading(false); 
  };

  return (
    // Divisão #1 (Área da Pesquisa)
    <main className="min-h-screen bg-[#1E2024] text-white">
      
      <DashboardHeader />
      
      <div className="w-full bg-[#1E2024] border-b border-gray-700">
        <div className="mx-auto max-w-8xl px-4 pt-10 pb-10 sm:px-6 lg:px-10">
          <div className="flex items-center gap-0">
            
            <button className="
              p-2 rounded-md text-lime-green
              hover:bg-lime-green/10 transition-colors
            ">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
            
            {/* --- MUDANÇA #3: Transformámos a 'section' num 'form' --- */}
            <form className="flex-grow max-w-lg mx-auto" onSubmit={handleSearchWrapper}>
              <div className="relative">
                <input 
                  type="text" 
                  value={query} 
                  onChange={(e) => setQuery(e.target.value)} 
                  placeholder="PESQUISAR JOGOS..." 
                  className="
                    w-full rounded-full border border-gray-700
                    bg-[#2A2D32] px-6 py-3 
                    font-pixel tracking-wider text-white placeholder-gray-500
                    focus:border-lime-400 focus:outline-none focus:ring-1 focus:ring-lime-400"
                />
                {/* O botão agora é do tipo 'submit' */}
                <button 
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2
                    rounded-full bg-lime-400 p-2.5
                    text-black transition-all hover:bg-lime-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                  </svg>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      {/* Divisão #2 (Jogos) - Fundo Escuro */}
      <div className="w-full bg-gray-900 mt-10"> 
        <div className="mx-auto max-w-6xl px-4 pt-0 pb-20 sm:px-6 lg:px-8">
          
          <div className="h-px bg-gray-600/50 my-10 border-none"></div>

          <section>
            <h2 className="mb-6 text-3xl font-bold text-white font-pixel tracking-wider">
              {results.length > 0 ? 'RESULTADOS DA BUSCA' : 'JOGOS RELEVANTES'}
            </h2>
            
            <div className="grid grid-cols-4 gap-8 md:grid-cols-4">
              
              {isSearchLoading && (
                <p className="col-span-4 text-center font-sans">Buscando...</p>
              )}

              {/* --- MUDANÇA #4: MOSTRAR IMAGENS DE QUALIDADE --- */}
              {!isSearchLoading && results.length > 0 && (
                results.map((game) => (
                  <div 
                    key={game.id} 
                    className="
                      cursor-pointer rounded-xl bg-[#2A2D32] shadow-lg 
                      border border-gray-700/50
                      transition-all duration-300 hover:border-lime-400/50 hover:scale-105
                    "
                  >
                    <div className="aspect-[4/3] w-full rounded-t-xl bg-[#393D44] flex items-center justify-center overflow-hidden">
                      {/* Usamos medium_url primeiro, se não existir, usamos thumb_url */}
                      {game.image && (game.image.medium_url || game.image.thumb_url) ? (
                        <Image
                          src={game.image.medium_url || game.image.thumb_url!}
                          alt={game.name}
                          width={300}
                          height={225}
                          className="w-full h-full object-cover rounded-t-xl"
                        />
                      ) : (
                        // Placeholder se o jogo não tiver imagem
                        <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l-1.586-1.586a2 2 0 00-2.828 0L6 18m6 6H6a2 2 0 01-2-2V6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2z" /></svg>
                      )}
                    </div>
                    <h3 className="p-3 font-sans text-sm font-semibold text-white truncate">
                      {game.name}
                    </h3>
                  </div>
                ))
              )}

              {/* Placeholders (Se não houver busca) */}
              {!isSearchLoading && results.length === 0 && (
                [...Array(8)].map((_, i) => (
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
                      Dragon&apos;s Crest: Age of Valor
                    </h3>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
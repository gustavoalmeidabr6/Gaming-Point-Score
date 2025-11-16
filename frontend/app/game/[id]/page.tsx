// Caminho do arquivo: frontend/app/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
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


// --- TIPOS (O seu código, sem mudanças) ---
type GameSearchResult = {
  id: number;
  name: string;
  image: { 
    thumb_url: string | null;
    medium_url: string | null; 
  };
};

type GameDetails = {
  id: number; 
  name: string;
  deck: string; 
  image: { medium_url: string; }; 
};

type ReviewForm = {
  jogabilidade: number;
  graficos: number;
  narrativa: number;
  audio: number;
  desempenho: number;
};

const defaultReviewState = {
  jogabilidade: 5,
  graficos: 5,
  narrativa: 5,
  audio: 5,
  desempenho: 5,
};


// --- NOVO COMPONENTE: GRÁFICO CIRCULAR ---
// Este componente cria os gráficos "lúdicos e bonitos" que você pediu
function CircularProgress({ value, size = 'small' }: { value: number; size?: 'small' | 'large' }) {
  const percentage = value * 10; // Converte a nota 0-10 para 0-100%
  
  // Define os tamanhos com base na prop 'size'
  const containerSize = size === 'large' ? 'w-32 h-32' : 'w-20 h-20';
  const innerSize = size === 'large' ? 'w-28 h-28' : 'w-16 h-16';
  const textSize = size === 'large' ? "text-3xl" : "text-lg";

  return (
    <div className={`relative ${containerSize} rounded-full flex items-center justify-center`}>
      {/* 1. O Gráfico (Conic Gradient) - Verde (lime-400) e Cinza (gray-700) */}
      <div 
        className="w-full h-full rounded-full transition-all duration-300"
        style={{ 
          background: `conic-gradient(#a3e635 ${percentage}%, #374151 ${percentage}%)` 
        }}
      ></div>
      
      {/* 2. O "Buraco" no meio (cor de fundo da caixa de review) */}
      <div className={`absolute ${innerSize} bg-gray-900 rounded-full`}></div>
      
      {/* 3. O Texto (A nota) */}
      <div className={`absolute font-pixel font-bold ${textSize} text-white`}>
        {value.toFixed(1)}
      </div>
    </div>
  );
}
// --- FIM DO NOVO COMPONENTE ---


// --- PÁGINA PRINCIPAL DO DASHBOARD ---
export default function DashboardPage() {
  // --- ESTADOS (O seu código, sem mudanças) ---
  const [query, setQuery] = useState(''); 
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [results, setResults] = useState<GameSearchResult[]>([]);
  const [selectedGame, setSelectedGame] = useState<GameDetails | null>(null);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);
  const [review, setReview] = useState<ReviewForm>(defaultReviewState);
  const [reviewStatus, setReviewStatus] = useState(''); 
  const [averageScore, setAverageScore] = useState<number | null>(null);

  // --- LÓGICA (O seu código, sem mudanças) ---
  useEffect(() => {
    if (!selectedGame) return; 

    const fetchReview = async () => {
      setReviewStatus('Carregando seu review...');
      try {
        const res = await fetch(`/api/review?game_id=${selectedGame.id}&owner_id=1`);
        const data = await res.json();
        
        if (data.error) {
          setReview(defaultReviewState);
          setAverageScore(5.0); 
          setReviewStatus('Seja o primeiro a avaliar!');
        } else {
          setReview({
            jogabilidade: data.jogabilidade,
            graficos: data.graficos,
            narrativa: data.narrativa,
            audio: data.audio,
            desempenho: data.desempenho,
          });
          setAverageScore(data.nota_geral);
          setReviewStatus('Review carregada do seu perfil.');
        }
      } catch (err) {
        setReviewStatus('Erro ao carregar review.');
      }
    };
    fetchReview();
  }, [selectedGame]); 

  
  const handleSearchWrapper = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); 
    handleSearch();     
  };

  const handleSearch = async () => {
    if (!query) return; 
    setIsSearchLoading(true);
    setResults([]); 
    setSelectedGame(null); 
    
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

  const handleGameClick = async (gameId: number) => {
    setIsDetailsLoading(true);
    setResults([]); 
    setReviewStatus('');
    setReview(defaultReviewState); 
    setAverageScore(null); 
    
    try {
      const res = await fetch(`/api/game/${gameId}`);
      const data = await res.json();
      if (data && data.name) {
        setSelectedGame(data); 
      }
    } catch (error) {
      console.error("Erro ao buscar detalhes do jogo:", error);
    }
    setIsDetailsLoading(false);
  };

  const handleBackToSearch = () => {
    setSelectedGame(null);
    setQuery(''); 
  };
  
  const handleReviewChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedReview = { ...review, [name]: Number(value) };
    setReview(updatedReview);
    
    const scores = Object.values(updatedReview);
    const newAverage = scores.reduce((a, b) => a + b, 0) / scores.length;
    setAverageScore(newAverage);
  };

  const handleSubmitReview = async () => {
    if (!selectedGame) return;
    setReviewStatus('Salvando...');
    
    const reviewData = { 
      ...review, 
      game_id: selectedGame.id, 
      game_name: selectedGame.name, 
      owner_id: 1 
    };
    
    try {
      const response = await fetch('/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData)
      });
      const data = await response.json();
      if (data.message) {
        setReviewStatus(data.message);
      } else {
        setReviewStatus(`Erro: ${data.error}`);
      }
    } catch (error) {
      setReviewStatus('Falha ao salvar review.');
    }
  };

  return (
    // Divisão #1 (Área da Pesquisa)
    <main className="min-h-screen bg-[#1E2024] text-white">
      
      <DashboardHeader />
      
      <div className={`w-full bg-[#1E2024] border-b border-gray-700 ${selectedGame ? 'hidden' : ''}`}>
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
      <div className="w-full bg-gray-900">
        <div className="mx-auto max-w-6xl px-4 pt-0 pb-20 sm:px-6 lg:px-8">
          
          <div className="h-px bg-gray-600/50 my-10 border-none"></div>

          {/* SE O JOGO NÃO ESTIVER SELECIONADO, MOSTRAR A BUSCA */}
          {!selectedGame && (
            <section>
              <h2 className="mb-6 text-3xl font-bold text-white font-pixel tracking-wider">
                {results.length > 0 ? 'RESULTADOS DA BUSCA' : 'JOGOS RELEVANTES'}
              </h2>
              
              <div className="grid grid-cols-4 gap-8 md:grid-cols-4">
                
                {isSearchLoading && (
                  <p className="col-span-4 text-center font-sans">Buscando...</p>
                )}

                {/* RESULTADOS DA API */}
                {!isSearchLoading && results.length > 0 && (
                  results.map((game) => (
                    <div 
                      key={game.id} 
                      onClick={() => handleGameClick(game.id)}
                      className="
                        cursor-pointer rounded-xl bg-[#2A2D32] shadow-lg 
                        border border-gray-700/50
                        transition-all duration-300 hover:border-lime-400/50 hover:scale-105
                      "
                    >
                      <div className="aspect-[4/3] w-full rounded-t-xl bg-[#393D44] flex items-center justify-center overflow-hidden">
                        {game.image && (game.image.medium_url || game.image.thumb_url) ? (
                          <Image
                            src={game.image.medium_url || game.image.thumb_url!}
                            alt={game.name}
                            width={300}
                            height={225}
                            className="w-full h-full object-cover rounded-t-xl"
                          />
                        ) : (
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
          )}

          {/* SE O JOGO ESTIVER A CARREGAR */}
          {isDetailsLoading && <p className="text-center text-lg text-white">Carregando jogo...</p>}
          
          {/* --- MUDANÇA #1: O NOVO VISUAL DA ABA DE AVALIAÇÃO COMEÇA AQUI --- */}
          {selectedGame && !isDetailsLoading && (
            <section className="rounded-xl bg-[#2A2D32] p-6 shadow-lg border border-gray-700/50">
              
              <button 
                onClick={handleBackToSearch} 
                className="mb-4 rounded-md bg-gray-600 px-4 py-2 text-sm text-white transition-all hover:bg-gray-500 font-sans"
              >
                &larr; Voltar para a Busca
              </button>
              
              <div className="flex flex-col gap-8 md:flex-row">
                <Image 
                  src={selectedGame.image.medium_url} 
                  alt={selectedGame.name} 
                  width={500}
                  height={600}
                  className="w-full rounded-lg md:w-1/2 lg:w-1/3 object-cover" 
                />
                
                <div className="flex-1">
                  <h2 className="mb-2 text-3xl font-bold text-white font-pixel">{selectedGame.name}</h2>
                  <p className="mb-4 text-sm text-gray-400 font-sans max-h-40 overflow-y-auto">
                    {selectedGame.deck}
                  </p>
                  
                  {/* Caixa de Review (Novo Layout) */}
                  <div className="rounded-lg bg-gray-900 border border-gray-700 p-6">
                    <h3 className="text-2xl font-semibold text-white font-pixel mb-4">Meu Review</h3>
                    
                    <div className="flex flex-col md:flex-row gap-6">
                      
                      {/* Coluna Esquerda: 5 Gráficos Pequenos + 5 Sliders */}
                      <div className="flex-1 space-y-4">
                        
                        {/* Os 5 gráficos em grelha */}
                        <div className="grid grid-cols-3 gap-4">
                          {(Object.keys(review) as Array<keyof ReviewForm>).map((key) => (
                            <div key={key} className="flex flex-col items-center">
                              <CircularProgress value={review[key]} size="small" />
                              <label className="mt-2 text-xs capitalize text-gray-300 font-sans">
                                {key}
                              </label>
                            </div>
                          ))}
                        </div>
                        
                        <hr className="my-4 border-gray-700"/>
                        
                        {/* Os 5 sliders (agora separados) */}
                        <div className="space-y-3">
                          {(Object.keys(review) as Array<keyof ReviewForm>).map((key) => (
                             <div key={key}>
                               <label className="mb-1 block text-sm capitalize text-gray-300 font-sans">
                                 {key}: <span className="font-bold text-white">{review[key]}</span>
                               </label>
                               <input
                                 type="range" name={key} min="0" max="10" step="0.5"
                                 value={review[key]} 
                                 onChange={handleReviewChange}
                                 className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-lime-400"
                               />
                             </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Coluna Direita: Gráfico Grande (Média) */}
                      <div className="flex flex-col items-center justify-center p-4">
                        <h4 className="text-lg font-pixel text-white mb-2">Média Geral</h4>
                        {averageScore !== null && (
                           <CircularProgress value={averageScore} size="large" />
                        )}
                      </div>
                      
                    </div>
                    
                    {/* Botão Salvar (agora fora das colunas) */}
                    <button 
                      onClick={handleSubmitReview}
                      className="mt-6 w-full rounded-md bg-lime-400 px-6 py-3 font-bold text-black transition-all hover:bg-lime-300 font-pixel text-lg"
                    >
                      Salvar Review
                    </button>
                    <p className={`mt-3 text-center text-sm font-sans ${reviewStatus.includes('Erro') ? 'text-red-400' : 'text-lime-400'}`}>
                      {reviewStatus}
                    </p>
                  </div>
                </div>
              </div>
            </section>
          )}
          {/* --- FIM DA MUDANÇA --- */}

        </div>
      </div>
    </main>
  );
}
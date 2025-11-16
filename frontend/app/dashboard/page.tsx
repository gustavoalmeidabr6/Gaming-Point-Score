// Caminho do arquivo: frontend/app/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react'; // Adicionámos o 'useEffect'
import Image from 'next/image';

// --- COMPONENTE DO HEADER (Sem mudanças) ---
function DashboardHeader() {
  return (
    <header className="relative w-full h-68"> 
      <Image
        src="/images/dashboard-banner.jpg" //
        alt="Banner do perfil"
        fill
        className="object-cover z-0"
      />
      <div className="absolute z-20 inset-0 flex items-center justify-center pt-44">
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

// --- NOVOS TIPOS (Reintroduzidos) ---
type GameSearchResult = {
  id: number;
  name: string;
  image: { 
    thumb_url: string | null;
    medium_url: string | null;
  };
};
// Este é para os Detalhes do Jogo (quando clicado)
type GameDetails = {
  id: number; 
  name: string;
  deck: string; // A descrição
  image: { medium_url: string; }; // A foto principal
};
// Este é para o formulário de review
type ReviewForm = {
  jogabilidade: number;
  graficos: number;
  narrativa: number;
  audio: number;
  desempenho: number;
};
// Estado padrão do review
const defaultReviewState = {
  jogabilidade: 5,
  graficos: 5,
  narrativa: 5,
  audio: 5,
  desempenho: 5,
};


// --- PÁGINA PRINCIPAL DO DASHBOARD ---
export default function DashboardPage() {
  const [query, setQuery] = useState(''); 
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [results, setResults] = useState<GameSearchResult[]>([]);

  // --- NOVOS ESTADOS (Reintroduzidos) ---
  const [selectedGame, setSelectedGame] = useState<GameDetails | null>(null);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);
  const [review, setReview] = useState<ReviewForm>(defaultReviewState);
  const [reviewStatus, setReviewStatus] = useState(''); 
  const [averageScore, setAverageScore] = useState<number | null>(null);

  
  // --- NOVO 'useEffect' (Para carregar um review salvo) ---
  // Roda sempre que um 'selectedGame' muda
  useEffect(() => {
    if (!selectedGame) return; // Se não há jogo, não faz nada

    const fetchReview = async () => {
      setReviewStatus('Carregando seu review...');
      try {
        // Busca um review EXISTENTE no seu banco de dados
        // (owner_id=1 é o nosso usuário de teste)
        const res = await fetch(`/api/review?game_id=${selectedGame.id}&owner_id=1`);
        const data = await res.json();
        
        if (data.error) {
          // Se não achou review, usa o estado padrão
          setReview(defaultReviewState);
          setAverageScore(5.0); // Média de 5
          setReviewStatus('Seja o primeiro a avaliar!');
        } else {
          // Se achou, preenche o formulário
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
  }, [selectedGame]); // Dependência: Roda quando 'selectedGame' muda


  // --- FUNÇÕES DE BUSCA (ATUALIZADAS) ---
  const handleSearchWrapper = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); 
    handleSearch();     
  };

  const handleSearch = async () => {
    if (!query) return; 
    setIsSearchLoading(true);
    setResults([]); 
    setSelectedGame(null); // Fecha a vista de detalhes se estiver aberta
    
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

  // --- NOVA FUNÇÃO (Quando você clica num Card) ---
  const handleGameClick = async (gameId: number) => {
    setIsDetailsLoading(true);
    setResults([]); // Limpa os resultados da busca
    setReviewStatus('');
    setReview(defaultReviewState); 
    setAverageScore(null); 
    
    try {
      const res = await fetch(`/api/game/${gameId}`);
      const data = await res.json();
      if (data && data.name) {
        setSelectedGame(data); // Define o jogo selecionado!
      }
    } catch (error) {
      console.error("Erro ao buscar detalhes do jogo:", error);
    }
    setIsDetailsLoading(false);
  };

  // --- NOVA FUNÇÃO (Para voltar para a busca) ---
  const handleBackToSearch = () => {
    setSelectedGame(null);
    setQuery(''); // Limpa a busca
  };
  
  // --- NOVAS FUNÇÕES DE REVIEW (Reintroduzidas) ---
  const handleReviewChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedReview = { ...review, [name]: Number(value) };
    setReview(updatedReview);
    
    // Calcula a média em tempo real
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
      owner_id: 1 // "Chumbado" para o usuário de teste 1
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
      
      {/* Container da Divisão #1 */}
      <div className="w-full bg-[#1E2024] border-b border-gray-700">
        <div className="mx-auto max-w-8xl px-4 pt-10 pb-10 sm:px-6 lg:px-10">
          <div className="flex items-center gap-0">
            
            <button className="p-2 rounded-md text-lime-green hover:bg-lime-green/10 transition-colors">
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

          {/* --- MUDANÇA #5: RENDERIZAÇÃO CONDICIONAL --- */}
          {/* Se um jogo NÃO está selecionado, mostre a busca/relevantes */}
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
                      // --- AQUI A MÁGICA ACONTECE ---
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

          {/* Se um jogo ESTÁ selecionado, mostre o painel de review */}
          {isDetailsLoading && <p className="text-center text-lg text-white">Carregando jogo...</p>}
          
          {selectedGame && !isDetailsLoading && (
            <section className="rounded-xl bg-[#2A2D32] p-6 shadow-lg border border-gray-700/50">
              {/* Botão Voltar */}
              <button 
                onClick={handleBackToSearch} 
                className="mb-4 rounded-md bg-gray-600 px-4 py-2 text-sm text-white transition-all hover:bg-gray-500 font-sans"
              >
                &larr; Voltar para a Busca
              </button>
              
              {/* Layout do Painel de Review */}
              <div className="flex flex-col gap-6 md:flex-row">
                {/* Coluna da Imagem */}
                <Image 
                  src={selectedGame.image.medium_url} 
                  alt={selectedGame.name} 
                  width={500}
                  height={600}
                  className="w-full rounded-lg md:w-1/2 lg:w-1/3 object-cover" 
                />
                
                {/* Coluna do Review */}
                <div className="flex-1">
                  <h2 className="mb-2 text-3xl font-bold text-white font-pixel">{selectedGame.name}</h2>
                  <p className="mb-4 text-sm text-gray-400 font-sans">
                    {selectedGame.deck}
                  </p>
                  
                  {/* Caixa dos Sliders (Gráfico de Barras) */}
                  <div className="rounded-lg bg-gray-900 border border-gray-700 p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold text-white font-pixel">Meu Review</h3>
                      {averageScore !== null && (
                        <h2 className="text-3xl font-bold text-lime-400 font-pixel">
                          {averageScore.toFixed(1)}
                        </h2>
                      )}
                    </div>
                    
                    <hr className="my-3 border-gray-700" />
                    
                    {/* Aqui está o seu "gráfico de barras" animado */}
                    {(Object.keys(review) as Array<keyof ReviewForm>).map((key) => (
                      <div key={key} className="mb-3">
                        <label className="mb-1 block text-sm capitalize text-gray-300 font-sans">
                          {key}: <span className="font-bold text-white">{review[key]}</span>
                        </label>
                        <input
                          type="range" name={key} min="0" max="10" step="0.5"
                          value={review[key]} 
                          onChange={handleReviewChange}
                          // A "animação" vem do 'accent-lime-green'
                          className="w-full accent-lime-400"
                        />
                      </div>
                    ))}
                    
                    <button 
                      onClick={handleSubmitReview}
                      className="mt-2 w-full rounded-md bg-lime-400 px-6 py-2 font-bold text-black transition-all hover:bg-lime-300 font-pixel"
                    >
                      Salvar Review
                    </button>
                    <p className={`mt-2 text-center text-sm font-sans ${reviewStatus.includes('Erro') ? 'text-red-400' : 'text-lime-400'}`}>
                      {reviewStatus}
                    </p>
                  </div>
                </div>
              </div>
            </section>
          )}

        </div>
      </div>
    </main>
  );
}
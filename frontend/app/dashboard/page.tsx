// Caminho do arquivo: frontend/app/dashboard/page.tsx
'use client';

// Lógica original (imports, types, etc.)
import { useState, useEffect } from 'react';

// --- Tipos (Original) ---
type GameSearchResult = {
  id: number;
  name: string;
  image: { thumb_url: string; };
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
type MyReview = {
  id: number;
  game_name: string;
  nota_geral: number;
};

const defaultReviewState = {
  jogabilidade: 5,
  graficos: 5,
  narrativa: 5,
  audio: 5,
  desempenho: 5,
};

export default function DashboardPage() {
  // --- Estados (Original) ---
  const [mensagem, setMensagem] = useState('Carregando...');
  const [dbStatus, setDbStatus] = useState('');
  
  const [myReviews, setMyReviews] = useState<MyReview[]>([]);

  const [query, setQuery] = useState(''); 
  const [results, setResults] = useState<GameSearchResult[]>([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [selectedGame, setSelectedGame] = useState<GameDetails | null>(null);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);

  const [review, setReview] = useState<ReviewForm>(defaultReviewState);
  const [reviewStatus, setReviewStatus] = useState(''); 
  const [averageScore, setAverageScore] = useState<number | null>(null);

  // --- NOVO ESTADO PARA AS ABAS ---
  const [activeTab, setActiveTab] = useState('buscar'); // 'buscar' ou 'perfil'


  // --- useEffect PRINCIPAL (Original, limpo) ---
  useEffect(() => {
    fetch('/api/ola').then(res => res.json()).then(data => setMensagem(data.mensagem));
    
    const initializeProfile = async () => {
      try {
        setDbStatus('Testando conexão...');
        const dbResponse = await fetch('/api/test-db');
        const dbData = await dbResponse.json();
        
        if (dbData.database_status) {
          setDbStatus(dbData.database_status);
          
          const reviewsResponse = await fetch('/api/my-reviews');
          const reviewsData = await reviewsResponse.json();
          
          if (Array.isArray(reviewsData)) {
            setMyReviews(reviewsData);
          } else {
            console.error("Erro ao carregar 'my-reviews':", reviewsData.error);
          }
          
        } else {
          setDbStatus(dbData.error || 'Falha ao conectar ao banco');
        }
        
      } catch (error) {
        console.error("Erro na inicialização:", error);
        setDbStatus('Erro grave de conexão.');
      }
    };
    
    initializeProfile();
    
  }, []); // Roda uma vez quando a página carrega

  // --- useEffect: Carrega a Review (Original) ---
  useEffect(() => {
    if (!selectedGame) return;
    const fetchReview = async () => {
      try {
        const res = await fetch(`/api/review?game_id=${selectedGame.id}&owner_id=1`);
        const data = await res.json();
        if (data.error) {
          setReview(defaultReviewState);
          setAverageScore((Object.values(defaultReviewState).reduce((a, b) => a + b, 0) / 5));
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


  // --- Funções de Busca (Original) ---
  const handleSearch = async () => {
    if (!query) return;
    setIsSearchLoading(true);
    setResults([]);
    setSelectedGame(null); 
    const res = await fetch(`/api/search?q=${query}`);
    const data = await res.json();
    if (Array.isArray(data)) setResults(data);
    setIsSearchLoading(false);
  };
  const handleGameClick = async (gameId: number) => {
    setIsDetailsLoading(true);
    setResults([]);
    setReviewStatus('');
    setReview(defaultReviewState); 
    setAverageScore(null); 
    const res = await fetch(`/api/game/${gameId}`);
    const data = await res.json();
    if (data && data.name) setSelectedGame(data);
    setIsDetailsLoading(false);
  };
  const handleBackToSearch = () => {
    setSelectedGame(null);
    setReview(defaultReviewState); 
    setReviewStatus('');
    setAverageScore(null);
  };
  
  // --- Funções de Review (Original) ---
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
    const reviewData = { ...review, game_id: selectedGame.id, game_name: selectedGame.name, owner_id: 1 };
    try {
      const response = await fetch('/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData)
      });
      const data = await response.json();
      if (data.message) {
        setReviewStatus(data.message);
        // Atualiza a lista do perfil em tempo real
        fetch('/api/my-reviews').then(res => res.json()).then(setMyReviews);
      } else {
        setReviewStatus(`Erro: ${data.error}`);
      }
    } catch (error) {
      setReviewStatus('Falha ao salvar review.');
    }
  };


  // --- HTML (JSX) - VERSÃO COM ABAS ---
  return (
    <main className="min-h-screen bg-gray-900 p-4 md:p-8 text-white">
      
      {/* --- SEÇÃO 1: CABEÇALHO DO PERFIL (Sempre visível) --- */}
      <section className="mb-8 flex items-center gap-4 rounded-lg bg-gray-800 p-6 shadow-lg">
        {/* Imagem de Perfil (Placeholder) */}
        <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full bg-gray-700 text-sm text-gray-400">
          Foto
        </div>
        
        {/* Informações do Perfil */}
        <div>
          <h1 className="text-3xl font-bold text-white">
            Usuário de Teste
          </h1>
          <p className="text-lg text-lime-400">
            Nível 5
          </p>
        </div>
      </section>

      {/* --- SEÇÃO 2: ABAS DE NAVEGAÇÃO --- */}
      <nav className="mb-8 flex border-b border-gray-700">
        <button
          // Muda o estilo se a aba 'buscar' estiver ativa
          className={`px-6 py-3 text-lg font-medium ${
            activeTab === 'buscar' 
            ? 'border-b-2 border-lime-400 text-lime-400' 
            : 'text-gray-400 hover:text-gray-200'
          }`}
          onClick={() => setActiveTab('buscar')}
        >
          Buscar
        </button>
        <button
          // Muda o estilo se a aba 'perfil' estiver ativa
          className={`px-6 py-3 text-lg font-medium ${
            activeTab === 'perfil' 
            ? 'border-b-2 border-lime-400 text-lime-400' 
            : 'text-gray-400 hover:text-gray-200'
          }`}
          onClick={() => setActiveTab('perfil')}
        >
          Meu Perfil Gamer
        </button>
        {/* Podemos adicionar a aba "Estatísticas" aqui no futuro */}
      </nav>

      {/* --- SEÇÃO 3: CONTEÚDO DAS ABAS --- */}

      {/* --- ABA DE BUSCA --- */}
      {/* 'hidden' do Tailwind esconde o 'div' se a condição for falsa */}
      <div className={activeTab === 'buscar' ? '' : 'hidden'}>
        
        {/* SE UM JOGO NÃO ESTIVER SELECIONADO (Mostra a Busca e Relevantes) */}
        {!selectedGame && (
          <>
            {/* Ferramenta de Busca */}
            <section className="mb-8 rounded-lg bg-gray-800 p-6 shadow-lg">
              <h2 className="mb-4 text-2xl font-semibold text-white">
                Buscar Jogo
              </h2>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={query} 
                  onChange={(e) => setQuery(e.target.value)} 
                  placeholder="Digite o nome de um jogo..." 
                  className="flex-grow rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-500 focus:border-lime-400 focus:outline-none focus:ring-lime-400"
                />
                <button 
                  onClick={handleSearch}
                  className="rounded-md bg-lime-400 px-6 py-2 font-bold text-black transition-all hover:bg-lime-300"
                >
                  {isSearchLoading ? 'Buscando...' : 'Buscar'}
                </button>
              </div>
            </section>
            
            {/* Resultados da Busca (se houver) */}
            {results.length > 0 && (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
                {results.map((game) => (
                  <div 
                    key={game.id} 
                    onClick={() => handleGameClick(game.id)} 
                    className="cursor-pointer rounded-lg bg-gray-700 p-2 transition-all hover:bg-gray-600"
                  >
                    <img src={game.image.thumb_url} alt={game.name} className="w-full rounded-md object-cover" />
                    <h3 className="mt-2 truncate text-sm font-medium text-white">{game.name}</h3>
                  </div>
                ))}
              </div>
            )}
            
            {/* Jogos Relevantes (Os "balões" que você pediu) */}
            {results.length === 0 && !isSearchLoading && (
              <section>
                <h2 className="mb-4 text-2xl font-semibold text-white">
                  Jogos Relevantes (Placeholders)
                </h2>
                {/* Placeholder dos "balões" */}
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
                  {/* Exemplo de Balão/Card de Jogo */}
                  <div className="rounded-lg bg-gray-800 p-3 shadow-lg">
                    <div className="h-48 w-full rounded-md bg-gray-700" /> {/* Imagem placeholder */}
                    <h3 className="mt-2 text-white">Jogo Relevante 1</h3>
                  </div>
                  <div className="rounded-lg bg-gray-800 p-3 shadow-lg">
                    <div className="h-48 w-full rounded-md bg-gray-700" />
                    <h3 className="mt-2 text-white">Jogo Relevante 2</h3>
                  </div>
                  <div className="rounded-lg bg-gray-800 p-3 shadow-lg">
                    <div className="h-48 w-full rounded-md bg-gray-700" />
                    <h3 className="mt-2 text-white">Jogo Relevante 3</h3>
                  </div>
                  {/* Adicione mais placeholders aqui */}
                </div>
              </section>
            )}
          </>
        )}

        {/* SE UM JOGO ESTIVER SELECIONADO (Mostra os Detalhes e Review) */}
        {isDetailsLoading && <p className="text-center text-lg text-white">Carregando detalhes...</p>}
        {selectedGame && !isDetailsLoading && (
          <section className="rounded-lg bg-gray-800 p-6 shadow-lg">
            <button 
              onClick={handleBackToSearch} 
              className="mb-4 rounded-md bg-gray-600 px-4 py-2 text-sm text-white transition-all hover:bg-gray-500"
            >
              &larr; Voltar
            </button>
            <div className="flex flex-col gap-6 md:flex-row">
              <img src={selectedGame.image.medium_url} alt={selectedGame.name} className="w-full rounded-lg md:w-1/2" />
              <div className="md:w-1/2">
                <h2 className="mb-2 text-3xl font-bold text-white">{selectedGame.name}</h2>
                <p className="mb-4 text-sm text-gray-400">{selectedGame.deck}</p>
                <div className="rounded-lg bg-gray-700 p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-white">Meu Review</h3>
                    {averageScore !== null && (
                      <h2 className="text-2xl font-bold text-lime-400">
                        {averageScore.toFixed(1)}
                      </h2>
                    )}
                  </div>
                  <hr className="my-3 border-gray-600" />
                  {(Object.keys(review) as Array<keyof ReviewForm>).map((key) => (
                    <div key={key} className="mb-3">
                      <label className="mb-1 block text-sm capitalize text-gray-300">
                        {key}: <span className="font-bold text-white">{review[key]}</span>
                      </label>
                      <input
                        type="range" name={key} min="0" max="10" step="0.5"
                        value={review[key]} onChange={handleReviewChange}
                        className="w-full accent-lime-400"
                      />
                    </div>
                  ))}
                  <button 
                    onClick={handleSubmitReview}
                    className="mt-2 w-full rounded-md bg-lime-400 px-6 py-2 font-bold text-black transition-all hover:bg-lime-300"
                  >
                    Salvar Review
                  </button>
                  <p className={`mt-2 text-center text-sm ${reviewStatus.includes('Erro') ? 'text-red-400' : 'text-lime-400'}`}>
                    {reviewStatus}
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>

      {/* --- ABA DE PERFIL GAMER --- */}
      {/* 'hidden' do Tailwind esconde o 'div' se a condição for falsa */}
      <div className={activeTab === 'perfil' ? '' : 'hidden'}>
        <section className="rounded-lg bg-gray-800 p-6 shadow-lg">
          <h2 className="mb-4 border-b border-gray-700 pb-3 text-2xl font-semibold text-white">
            Meus Jogos Avaliados
          </h2>
          {/* Esta é a lista que já estava funcionando, agora movida para esta aba */}
          {myReviews.length === 0 ? (
            <p className="text-gray-400">
              {dbStatus.includes('Testando') ? 'Carregando reviews...' : 'Você ainda não avaliou nenhum jogo.'}
            </p>
          ) : (
            <ul className="max-h-[600px] space-y-3 overflow-y-auto">
              {myReviews.map((review) => (
                <li 
                  key={review.id} 
                  className="flex items-center justify-between rounded-lg bg-gray-700 p-4"
                >
                  <span className="font-medium text-white">{review.game_name}</span>
                  <span className="rounded-md bg-lime-600 px-3 py-1 text-sm font-bold text-white">
                    {review.nota_geral.toFixed(1)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
        
        {/* Status da API (opcional, para debug) */}
        <div className="mt-4 rounded-lg bg-gray-800 p-4 text-xs text-gray-500">
          Status API: {mensagem} | Status Banco: {dbStatus}
        </div>
      </div>

    </main>
  );
}
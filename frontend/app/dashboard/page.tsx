'use client';

import { useState, useEffect } from 'react';

// --- Tipos ---
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

export default function Home() {
  // --- Estados ---
  const [mensagem, setMensagem] = useState('Carregando...');
  const [dbStatus, setDbStatus] = useState('');
  const [resetStatus, setResetStatus] = useState('');
  const [tableStatus, setTableStatus] = useState('');
  const [userStatus, setUserStatus] = useState('');
  
  const [myReviews, setMyReviews] = useState<MyReview[]>([]);

  const [query, setQuery] = useState(''); 
  const [results, setResults] = useState<GameSearchResult[]>([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [selectedGame, setSelectedGame] = useState<GameDetails | null>(null);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);

  const [review, setReview] = useState<ReviewForm>(defaultReviewState);
  const [reviewStatus, setReviewStatus] = useState(''); 
  const [averageScore, setAverageScore] = useState<number | null>(null);


  // --- useEffect PRINCIPAL (ATUALIZADO) ---
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

  // --- useEffect: Carrega a Review (Sem Mudanças) ---
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


  // --- Funções de Teste do Banco (Sem Mudanças) ---
  const handleResetDb = async () => {
    if (!confirm("TEM CERTEZA?")) return;
    setResetStatus('Apagando...');
    fetch('/api/DANGEROUS-RESET-DB').then(res => res.json()).then(data => setResetStatus(data.message || data.error));
  };
  const handleCreateTables = async () => {
    setTableStatus('Criando...');
    fetch('/api/create-tables').then(res => res.json()).then(data => setTableStatus(data.message || data.error));
  };
  const handleCreateUser = async () => {
    setUserStatus('Criando...');
    fetch('/api/create-user', { method: 'POST' }).then(res => res.json()).then(data => setUserStatus(data.message || data.error));
  };

  // --- Funções de Busca (Sem Mudanças) ---
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
  
  // --- Funções de Review (Sem Mudanças) ---
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


  // --- HTML (JSX) ---
  return (
    <main style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      
      {/* --- SEÇÃO DE STATUS --- */}
      <div style={{ padding: '10px', backgroundColor: '#f0f0f0', border: '1px solid #ccc', color: 'black', marginBottom: '20px' }}>
        <strong>Status API: {mensagem}</strong> | <strong>Status Banco: {dbStatus}</strong>
      </div>
      <div style={{ marginBottom: '10px' }}>
        <button onClick={handleResetDb} style={{backgroundColor: '#8B0000', color: 'white'}}>
          0. RESETAR BANCO (PERIGO)
        </button>
        <span style={{ color: 'white', marginLeft: '10px' }}>{resetStatus}</span>
      </div>
      <div style={{ marginBottom: '10px' }}>
        <button onClick={handleCreateTables}>1. Criar Tabelas</button>
        <span style={{ color: 'white', marginLeft: '10px' }}>{tableStatus}</span>
      </div>
      <div style={{ marginBottom: '30px' }}>
        <button onClick={handleCreateUser}>2. Criar Usuário</button>
        <span style={{ color: 'white', marginLeft: '10px' }}>{userStatus}</span>
      </div>
      <hr style={{ margin: '30px 0' }} />

      <h1>Meu Perfil Gamer</h1>
      
      {/* --- SEÇÃO DO PERFIL (MINHAS REVIEWS) --- */}
      <section style={{ marginBottom: '40px', padding: '20px', backgroundColor: '#1a1a1a', border: '1px solid #444', borderRadius: '8px' }}>
        <h2 style={{ color: 'white', marginTop: 0, borderBottom: '1px solid #555', paddingBottom: '10px' }}>
          Meus Jogos Avaliados
        </h2>
        {myReviews.length === 0 ? (
          <p style={{ color: '#ccc' }}>{dbStatus.includes('Testando') ? 'Carregando reviews...' : 'Você ainda não avaliou nenhum jogo.'}</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {myReviews.map((review) => (
              <li key={review.id} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '15px 10px', 
                borderBottom: '1px solid #333' 
              }}>
                <span style={{ color: 'white', fontSize: '18px' }}>{review.game_name}</span>
                <span style={{ 
                  color: 'lime', 
                  fontSize: '18px', 
                  fontWeight: 'bold', 
                  backgroundColor: 'rgba(0, 255, 0, 0.1)',
                  padding: '5px 10px',
                  borderRadius: '5px'
                }}>
                  Média: {review.nota_geral.toFixed(1)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* --- SEÇÃO 1: TELA DE BUSCA --- */}
      {!selectedGame && (
        <section>
          <h2>Buscar Jogo</h2>
          <div style={{ display: 'flex' }}>
            {/* --- !!! AQUI ESTÁ A CORREÇÃO !!! --- */}
            <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Digite o nome de um jogo..." style={{ fontSize: '16px', padding: '10px', color: 'black', width: '300px' }} />
            <button onClick={handleSearch} style={{ fontSize: '16px', padding: '10px', marginLeft: '10px' }}>
              {isSearchLoading ? 'Buscando...' : 'Buscar'}
            </button>
          </div>
          <div style={{ marginTop: '30px' }}>
            {results.map((game) => (
              <div key={game.id} onClick={() => handleGameClick(game.id)} style={{ display: 'flex', alignItems: 'center', marginBottom: '15px', padding: '10px', backgroundColor: '#333', cursor: 'pointer' }}>
                <img src={game.image.thumb_url} alt={game.name} style={{ width: '100px', height: 'auto', marginRight: '15px' }} />
                <h3 style={{ color: 'white' }}>{game.name}</h3>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Carregando Detalhes */}
      {isDetailsLoading && <p style={{ color: 'white' }}>Carregando detalhes...</p>}

      {/* --- SEÇÃO 2: TELA DE DETALHES --- */}
      {selectedGame && !isDetailsLoading && (
        <section>
          <button onClick={handleBackToSearch} style={{ fontSize: '16px', padding: '10px', marginBottom: '20px' }}>
            &larr; Voltar para a Busca
          </button>
          <img src={selectedGame.image.medium_url} alt={selectedGame.name} style={{ width: '100%', maxWidth: '400px', height: 'auto' }}/>
          <h2 style={{ color: 'white', marginTop: '20px' }}>{selectedGame.name}</h2>
          <p style={{ color: '#ccc' }}>{selectedGame.deck}</p>
          <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#222', maxWidth: '500px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ color: 'white', margin: 0 }}>Meu Review</h3>
              {averageScore !== null && (
                <h2 style={{ color: 'lime', margin: 0 }}>
                  Média: {averageScore.toFixed(1)}
                </h2>
              )}
            </div>
            <hr style={{ margin: '15px 0', borderColor: '#444' }} />
            {(Object.keys(review) as Array<keyof ReviewForm>).map((key) => (
              <div key={key} style={{ marginBottom: '15px' }}>
                <label style={{ color: 'white', textTransform: 'capitalize', display: 'block', marginBottom: '5px' }}>
                  {key}: {review[key]}
                </label>
                <input
                  type="range"
                  name={key}
                  min="0"
                  max="10"
                  step="0.5"
                  value={review[key]}
                  onChange={handleReviewChange}
                  style={{ width: '100%' }}
                />
              </div>
            ))}
            <button onClick={handleSubmitReview} style={{ fontSize: '16px', padding: '10px 20px', marginTop: '10px' }}>
              Salvar Review
            </button>
            <span style={{ color: reviewStatus.includes('Erro') ? 'red' : 'lime', marginLeft: '15px' }}>
              {reviewStatus}
            </span>
          </div>
        </section>
      )}
      
    </main>
  );
}
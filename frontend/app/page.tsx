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
// Estado inicial para resetar o formulário
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
  
  const [query, setQuery] = useState(''); 
  const [results, setResults] = useState<GameSearchResult[]>([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [selectedGame, setSelectedGame] = useState<GameDetails | null>(null);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);

  const [review, setReview] = useState<ReviewForm>(defaultReviewState);
  const [reviewStatus, setReviewStatus] = useState(''); 

  // --- useEffect para Status ---
  useEffect(() => {
    fetch('/api/ola').then(res => res.json()).then(data => setMensagem(data.mensagem));
    fetch('/api/test-db').then(res => res.json()).then(data => setDbStatus(data.database_status || data.error));
  }, []);

  // --- !!! NOVO useEffect: Carrega a Review quando um Jogo é Selecionado !!! ---
  useEffect(() => {
    // Se nenhum jogo está selecionado, não faça nada
    if (!selectedGame) {
      return;
    }
    
    // Função async para buscar a review
    const fetchReview = async () => {
      try {
        // Busca pela review do usuário 1 (hardcoded)
        const res = await fetch(`/api/review?game_id=${selectedGame.id}&owner_id=1`);
        const data = await res.json();
        
        if (data.error) {
          // Nenhuma review encontrada, reseta o formulário
          setReview(defaultReviewState);
          setReviewStatus('Seja o primeiro a avaliar!');
        } else {
          // Review encontrada! Preenche o formulário
          setReview({
            jogabilidade: data.jogabilidade,
            graficos: data.graficos,
            narrativa: data.narrativa,
            audio: data.audio,
            desempenho: data.desempenho,
          });
          setReviewStatus('Review carregada do seu perfil.');
        }
      } catch (err) {
        console.error("Falha ao buscar review", err);
        setReviewStatus('Erro ao carregar review.');
      }
    };
    
    // Chama a função
    fetchReview();
    
  }, [selectedGame]); // Este array faz o hook rodar toda vez que 'selectedGame' muda


  // --- Funções de Teste do Banco ---
  const handleResetDb = async () => {
    if (!confirm("TEM CERTEZA? Isso vai apagar TODOS os usuários e reviews.")) return;
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

  // --- Funções de Busca ---
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
    // Limpa o status e o formulário *antes* de carregar o novo jogo
    setReviewStatus('');
    setReview(defaultReviewState); 
    
    const res = await fetch(`/api/game/${gameId}`);
    const data = await res.json();
    
    // Isso vai disparar o useEffect lá em cima
    if (data && data.name) setSelectedGame(data);
    
    setIsDetailsLoading(false);
  };

  const handleBackToSearch = () => {
    setSelectedGame(null);
    setReview(defaultReviewState); // Reseta o formulário
    setReviewStatus('');
  };
  
  // --- Funções de Review ---
  const handleReviewChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setReview(prev => ({
      ...prev,
      [name]: Number(value),
    }));
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

      {/* --- SEÇÃO 1: TELA DE BUSCA --- */}
      {!selectedGame && (
        <section>
          <h2>Buscar Jogo</h2>
          <div style={{ display: 'flex' }}>
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

          {/* --- Formulário de Review --- */}
          <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#222', maxWidth: '500px' }}>
            <h3 style={{ color: 'white' }}>Meu Review</h3>
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
            {/* O status agora pode ter cores diferentes */}
            <span style={{ color: reviewStatus.includes('Erro') ? 'red' : 'lime', marginLeft: '15px' }}>
              {reviewStatus}
            </span>
          </div>
        </section>
      )}
      
    </main>
  );
}
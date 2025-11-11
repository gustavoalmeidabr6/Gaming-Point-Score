'use client';

import { useState, useEffect } from 'react';

// --- Tipos ---
// Tipo para o resultado da busca (Lista)
type GameSearchResult = {
  id: number;
  name: string;
  image: {
    thumb_url: string; 
  };
};

// Tipo para os detalhes de um jogo (Individual)
type GameDetails = {
  name: string;
  deck: string; // "deck" é a descrição curta no Giant Bomb
  image: {
    medium_url: string; // Vamos usar uma imagem um pouco maior
  };
};

export default function Home() {
  const [mensagem, setMensagem] = useState('Carregando mensagem do backend...');
  
  // Estados da Busca
  const [query, setQuery] = useState(''); 
  const [results, setResults] = useState<GameSearchResult[]>([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);

  // --- NOVOS ESTADOS ---
  // Guarda os detalhes do jogo que foi clicado
  const [selectedGame, setSelectedGame] = useState<GameDetails | null>(null);
  // Mostra "carregando" enquanto busca os detalhes
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);


  // (useEffect para o "Olá" - sem mudanças)
  useEffect(() => {
    fetch('/api/ola') 
      .then(response => response.json())
      .then(data => setMensagem(data.mensagem))
      .catch(error => console.error('Erro ao buscar /api/ola:', error));
  }, []); 

  // (Função de Busca - sem mudanças)
  const handleSearch = async () => {
    if (!query) return;
    setIsSearchLoading(true);
    setResults([]);
    setSelectedGame(null); // Limpa o jogo selecionado se fizermos nova busca

    try {
      const response = await fetch(`/api/search?q=${query}`);
      const data = await response.json();
      if (Array.isArray(data)) setResults(data);
      else console.error('Erro na busca:', data.error);
    } catch (error) {
      console.error('Falha ao fazer a busca:', error);
    }
    setIsSearchLoading(false);
  };

  // --- !!! NOVA FUNÇÃO: CHAMADA AO CLICAR NO JOGO !!! ---
  const handleGameClick = async (gameId: number) => {
    setIsDetailsLoading(true);
    setResults([]); // Esconde os resultados da busca
    
    try {
      const response = await fetch(`/api/game/${gameId}`);
      const data = await response.json();
      
      // Se 'data' tiver a chave 'name' (sucesso), salve-o.
      // O 'data' que vem do backend é o objeto 'results'
      if (data && data.name) {
        setSelectedGame(data);
      } else {
        console.error('Erro ao buscar detalhes:', data.error);
        setSelectedGame(null);
      }
    } catch (error) {
      console.error('Falha ao buscar detalhes:', error);
    }
    
    setIsDetailsLoading(false);
  };

  // --- !!! NOVA FUNÇÃO: VOLTAR PARA A BUSCA ---
  const handleBackToSearch = () => {
    setSelectedGame(null);
    // (Poderíamos re-exibir os resultados da busca anterior se os tivéssemos salvo)
    // Por enquanto, apenas limpamos a tela.
  };


  // --- HTML (JSX) ---
  return (
    <main style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      
      <div style={{ padding: '10px', backgroundColor: '#f0f0f0', border: '1px solid #ccc', color: 'black', marginBottom: '20px' }}>
        <strong>Status: {mensagem}</strong>
      </div>

      <h1>Meu Perfil Gamer</h1>

      {/* --- SEÇÃO 1: TELA DE BUSCA (Padrão) --- */}
      {/* Só mostra se NENHUM jogo estiver selecionado */}
      {!selectedGame && (
        <section>
          <h2>Buscar Jogo</h2>
          <div style={{ display: 'flex' }}>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Digite o nome de um jogo..."
              style={{ fontSize: '16px', padding: '10px', color: 'black', width: '300px' }}
            />
            <button onClick={handleSearch} style={{ fontSize: '16px', padding: '10px', marginLeft: '10px' }}>
              {isSearchLoading ? 'Buscando...' : 'Buscar'}
            </button>
          </div>

          <div style={{ marginTop: '30px' }}>
            {results.map((game) => (
              // --- ISSO AGORA É CLICÁVEL ---
              <div 
                key={game.id} 
                onClick={() => handleGameClick(game.id)} // --- AQUI ---
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  marginBottom: '15px', 
                  padding: '10px', 
                  backgroundColor: '#333',
                  cursor: 'pointer' // Mostra a "mãozinha"
                }}
              >
                <img 
                  src={game.image.thumb_url} 
                  alt={game.name} 
                  style={{ width: '100px', height: 'auto', marginRight: '15px' }} 
                />
                <h3 style={{ color: 'white' }}>{game.name}</h3>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Mostra "Carregando..." enquanto busca detalhes */}
      {isDetailsLoading && <p style={{ color: 'white' }}>Carregando detalhes...</p>}

      {/* --- SEÇÃO 2: TELA DE DETALHES --- */}
      {/* Só mostra se UM jogo ESTIVER selecionado */}
      {selectedGame && !isDetailsLoading && (
        <section>
          <button onClick={handleBackToSearch} style={{ fontSize: '16px', padding: '10px', marginBottom: '20px' }}>
            &larr; Voltar para a Busca
          </button>
          
          <img 
            src={selectedGame.image.medium_url} 
            alt={selectedGame.name} 
            style={{ width: '100%', maxWidth: '400px', height: 'auto' }}
          />
          <h2 style={{ color: 'white', marginTop: '20px' }}>{selectedGame.name}</h2>
          <p style={{ color: '#ccc' }}>{selectedGame.deck}</p>

          {/* Aqui é onde você colocaria o sistema de notas no futuro */}
          <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#222' }}>
            <h3 style={{ color: 'white' }}>Meu Review</h3>
            <p style={{ color: '#ccc' }}>[O sistema de avaliação (estrelas, notas, etc.) entrará aqui]</p>
          </div>
        </section>
      )}
      
    </main>
  );
}
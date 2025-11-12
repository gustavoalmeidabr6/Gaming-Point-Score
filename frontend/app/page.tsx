'use client';

import { useState, useEffect } from 'react';

// --- Tipos (Sem Mudanças) ---
type GameSearchResult = {
  id: number;
  name: string;
  image: { thumb_url: string; };
};
type GameDetails = {
  name: string;
  deck: string;
  image: { medium_url: string; };
};

export default function Home() {
  // --- Estados Antigos ---
  const [mensagem, setMensagem] = useState('Carregando...');
  const [query, setQuery] = useState(''); 
  const [results, setResults] = useState<GameSearchResult[]>([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [selectedGame, setSelectedGame] = useState<GameDetails | null>(null);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);

  // --- Estados do Banco (ATUALIZADOS) ---
  const [dbStatus, setDbStatus] = useState('Testando conexão com o banco...');
  const [tableStatus, setTableStatus] = useState(''); // NOVO
  const [userStatus, setUserStatus] = useState('');

  // --- useEffect para "Olá" e TESTE DE BANCO ---
  useEffect(() => {
    fetch('/api/ola') 
      .then(response => response.json())
      .then(data => setMensagem(data.mensagem))
      .catch(error => console.error('Erro ao buscar /api/ola:', error));

    fetch('/api/test-db')
      .then(response => {
        if (!response.ok) {
           // Se a resposta não for OK (ex: 500), lemos como texto
           return response.text().then(text => {
             throw new Error(`Falha na API: ${text}`);
           });
        }
        return response.json(); // Se for OK, lemos como JSON
      })
      .then(data => {
        if (data.database_status) {
          setDbStatus(data.database_status);
        } else {
          // Agora podemos mostrar o erro JSON que o backend enviou
          setDbStatus(`Erro no banco: ${data.error}`);
        }
      })
      .catch(error => {
          // Este é o "catch" que pegou seu erro JSON.
          console.error("Erro no fetch de /api/test-db:", error);
          setDbStatus(`Falha grave ao testar o banco: ${error.message}`);
      });

  }, []); // Roda uma vez quando a página carrega

  // --- Funções de Busca (Sem Mudanças) ---
  const handleSearch = async () => {
    if (!query) return;
    setIsSearchLoading(true);
    setResults([]);
    setSelectedGame(null); 
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

  const handleGameClick = async (gameId: number) => {
    setIsDetailsLoading(true);
    setResults([]);
    try {
      const response = await fetch(`/api/game/${gameId}`);
      const data = await response.json();
      if (data && data.name) setSelectedGame(data);
      else console.error('Erro ao buscar detalhes:', data.error);
    } catch (error) {
      console.error('Falha ao buscar detalhes:', error);
    }
    setIsDetailsLoading(false);
  };

  const handleBackToSearch = () => {
    setSelectedGame(null);
  };
  
  // --- !!! NOVA FUNÇÃO: CRIAR TABELAS !!! ---
  const handleCreateTables = async () => {
    setTableStatus('Criando tabelas...');
    try {
      const response = await fetch('/api/create-tables');
      
      if (!response.ok) { // Checagem de erro
          const errorText = await response.text();
          throw new Error(`Falha na API ao criar tabelas: ${errorText}`);
      }
        
      const data = await response.json();
      if (data.message) {
        setTableStatus(data.message);
      } else {
        setTableStatus(`Erro ao criar tabelas: ${data.error}`);
      }
    } catch (error: any) {
      setTableStatus(`Falha grave ao criar tabelas: ${error.message}`);
    }
  };

  // --- ATUALIZADO: Criar Usuário ---
  const handleCreateUser = async () => {
    setUserStatus('Criando usuário...');
    try {
      const response = await fetch('/api/create-user', { method: 'POST' });

      if (!response.ok) { // Checagem de erro
          const errorText = await response.text();
          throw new Error(`Falha na API ao criar usuário: ${errorText}`);
      }

      const data = await response.json();
      if (data.message) {
        setUserStatus(`${data.message} (ID: ${data.user_id})`);
      } else {
        setUserStatus(`Erro ao criar: ${data.error}`);
      }
    } catch (error: any) {
      setUserStatus(`Falha grave ao criar usuário: ${error.message}`);
    }
  };

  // --- HTML (JSX) ---
  return (
    <main style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      
      {/* --- SEÇÃO DE STATUS --- */}
      <div style={{ padding: '10px', backgroundColor: '#f0f0f0', border: '1px solid #ccc', color: 'black', marginBottom: '20px' }}>
        <strong>Status API: {mensagem}</strong>
        <br />
        <strong>Status Banco: {dbStatus}</strong>
      </div>

      {/* --- SEÇÃO DE TESTE DO BANCO (ATUALIZADA) --- */}
      <div style={{ marginBottom: '30px', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <button onClick={handleCreateTables} style={{ fontSize: '16px', padding: '10px' }}>
          1. Criar Tabelas no Banco
        </button>
        {tableStatus && <p style={{ color: 'white', margin: '0' }}>{tableStatus}</p>}
      </div>
      <div style={{ marginBottom: '30px', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <button onClick={handleCreateUser} style={{ fontSize: '16px', padding: '10px' }}>
          2. Criar Usuário de Teste
        </button>
        {userStatus && <p style={{ color: 'white', margin: '0' }}>{userStatus}</p>}
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

      {/* --- SEÇÃO 2: TELA DE DETALES --- */}
      {selectedGame && !isDetailsLoading && (
        <section>
          <button onClick={handleBackToSearch} style={{ fontSize: '16px', padding: '10px', marginBottom: '20px' }}>
            &larr; Voltar para a Busca
          </button>
          
          <img src={selectedGame.image.medium_url} alt={selectedGame.name} style={{ width: '100%', maxWidth: '400px', height: 'auto' }}/>
          <h2 style={{ color: 'white', marginTop: '20px' }}>{selectedGame.name}</h2>
          <p style={{ color: '#ccc' }}>{selectedGame.deck}</p>

          <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#222' }}>
            <h3 style={{ color: 'white' }}>Meu Review</h3>
            <p style={{ color: '#ccc' }}>[O sistema de avaliação (estrelas, notas, etc.) entrará aqui]</p>
          </div>
        </section>
      )}
      
    </main>
  );
}
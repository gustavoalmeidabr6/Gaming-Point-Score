'use client';

import { useState, useEffect } from 'react';

// ATUALIZADO: O tipo Game agora reflete a API do Giant Bomb
type Game = {
  id: number;
  name: string;
  // A imagem agora é um objeto dentro de outro objeto
  image: {
    thumb_url: string; 
  };
};

export default function Home() {
  const [mensagem, setMensagem] = useState('Carregando mensagem do backend...');
  
  const [query, setQuery] = useState(''); 
  const [results, setResults] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // (useEffect para o "Olá" - sem mudanças)
  useEffect(() => {
    fetch('/api/ola') 
      .then(response => response.json())
      .then(data => setMensagem(data.mensagem))
      .catch(error => {
        console.error('Erro ao buscar /api/ola:', error);
        setMensagem('Falha ao conectar com o backend.');
      });
  }, []); 

  // (Função de Busca - sem mudanças na lógica)
  const handleSearch = async () => {
    if (!query) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    setResults([]);

    try {
      const response = await fetch(`/api/search?q=${query}`);
      const data = await response.json();
      
      if (Array.isArray(data)) {
        setResults(data);
      } else {
        console.error('Erro na busca:', data.error);
        setResults([]);
      }

    } catch (error) {
      console.error('Falha ao fazer a busca:', error);
    }
    
    setIsLoading(false);
  };

  // --- HTML (JSX) ---
  return (
    <main style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      
      {/* Seção 1: O "Olá" */}
      <div style={{ padding: '10px', backgroundColor: '#f0f0f0', border: '1px solid #ccc', color: 'black', marginBottom: '20px' }}>
        <strong>Status: {mensagem}</strong>
      </div>

      {/* Seção 2: A Busca */}
      <h1>Meu Perfil Gamer</h1>
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
          {isLoading ? 'Buscando...' : 'Buscar'}
        </button>
      </div>

      {/* Seção 3: Os Resultados */}
      <div style={{ marginTop: '30px' }}>
        {results.map((game) => (
          <div key={game.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '15px', padding: '10px', backgroundColor: '#333' }}>
            {/* ATUALIZADO: O caminho da imagem mudou */}
            <img 
              src={game.image.thumb_url} 
              alt={game.name} 
              style={{ width: '100px', height: 'auto', marginRight: '15px' }} 
            />
            <h3 style={{ color: 'white' }}>{game.name}</h3>
          </div>
        ))}
      </div>

    </main>
  );
}
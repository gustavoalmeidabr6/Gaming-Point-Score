// Este 'use client' é obrigatório para usarmos 'useState' e 'useEffect'
'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  // Cria um "estado" para guardar a mensagem que vem do backend
  const [mensagem, setMensagem] = useState('Carregando mensagem do backend...');

  // 'useEffect' roda quando a página carrega
  useEffect(() => {
    // Tenta "buscar" (fetch) a mensagem da nossa API
    // O /api/ola é o endpoint que criamos no index.py
    fetch('/api/ola') 
      .then(response => response.json()) // Converte a resposta para JSON
      .then(data => {
        // Salva a mensagem do JSON no nosso "estado"
        setMensagem(data.mensagem); 
      })
      .catch(error => {
        // Se der erro
        console.error('Erro ao buscar dados:', error);
        setMensagem('Falha ao conectar com o backend.');
      });
  }, []); // O [] faz isso rodar apenas uma vez

  // Isso é o que será mostrado na tela (HTML)
  return (
    <main style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      <h1>Meu Perfil Gamer</h1>
      <p>Status da Conexão com o Backend:</p>
      <div style={{ padding: '20px', backgroundColor: '#f0f0f0', border: '1px solid #ccc' }}>
        <strong>{mensagem}</strong>
      </div>
    </main>
  );
}
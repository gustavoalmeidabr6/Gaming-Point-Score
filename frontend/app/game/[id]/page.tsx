// Caminho do arquivo: frontend/app/game/[id]/page.tsx
'use client';

// Imports necessários para esta página
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation'; // Hooks para ler a URL

// --- TIPOS (Os mesmos que movêmos do dashboard) ---
type GameDetails = {
  id: number; 
  name: string;
  deck: string; // A descrição
  image: { medium_url: string; }; // A foto principal
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


// --- PÁGINA DE AVALIAÇÃO DO JOGO ---
export default function GameReviewPage() {
  // Hooks do Next.js para navegação e leitura da URL
  const router = useRouter(); // Para o botão "Voltar"
  const params = useParams(); // Para ler o [id] da URL
  const { id } = params; // O ID do jogo (ex: "123")

  // Estados para esta página
  const [game, setGame] = useState<GameDetails | null>(null);
  const [review, setReview] = useState<ReviewForm>(defaultReviewState);
  const [averageScore, setAverageScore] = useState<number | null>(5.0);
  const [reviewStatus, setReviewStatus] = useState(''); 
  const [isLoading, setIsLoading] = useState(true);

  // useEffect para carregar TUDO quando a página abre
  useEffect(() => {
    if (!id) return; // Se não houver ID na URL, não faz nada

    const loadGameData = async () => {
      setIsLoading(true);
      
      // --- PASSO 1: Buscar os detalhes do jogo (Foto, Descrição) ---
      try {
        const gameRes = await fetch(`/api/game/${id}`);
        const gameData = await gameRes.json();
        if (gameData && gameData.name) {
          setGame(gameData);
        } else {
          setReviewStatus('Erro: Jogo não encontrado.');
        }
      } catch (err) {
        setReviewStatus('Erro ao carregar dados do jogo.');
      }

      // --- PASSO 2: Buscar o review salvo (se existir) ---
      try {
        const reviewRes = await fetch(`/api/review?game_id=${id}&owner_id=1`);
        const reviewData = await reviewRes.json();
        
        if (reviewData.error) {
          setReview(defaultReviewState);
          setAverageScore(5.0); 
          setReviewStatus('Seja o primeiro a avaliar!');
        } else {
          setReview({
            jogabilidade: reviewData.jogabilidade,
            graficos: reviewData.graficos,
            narrativa: reviewData.narrativa,
            audio: reviewData.audio,
            desempenho: reviewData.desempenho,
          });
          setAverageScore(reviewData.nota_geral);
          setReviewStatus('Review carregada.');
        }
      } catch (err) {
        setReviewStatus('Erro ao carregar review salvo.');
      }
      
      setIsLoading(false);
    };

    loadGameData();
  }, [id]); // Roda sempre que o 'id' da URL mudar


  // --- Funções de Lógica (Movidas do dashboard) ---
  const handleReviewChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedReview = { ...review, [name]: Number(value) };
    setReview(updatedReview);
    
    const scores = Object.values(updatedReview);
    const newAverage = scores.reduce((a, b) => a + b, 0) / scores.length;
    setAverageScore(newAverage);
  };

  const handleSubmitReview = async () => {
    if (!game) return;
    setReviewStatus('Salvando...');
    
    const reviewData = { 
      ...review, 
      game_id: game.id, 
      game_name: game.name, 
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


  // --- Renderização ---
  
  // Ecrã de Carregamento
  if (isLoading || !game) {
    return (
      <main className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p className="font-pixel text-2xl">Carregando Jogo...</p>
      </main>
    );
  }

  // Ecrã Principal (O SEU DESIGN 'image_0d1bc3.jpg')
  return (
    <main className="min-h-screen bg-gray-900 text-white p-6 md:p-12">
      
      {/* Botão Voltar */}
      <button 
        onClick={() => router.push('/dashboard')} 
        className="mb-6 rounded-md bg-gray-600 px-4 py-2 text-sm text-white transition-all hover:bg-gray-500 font-sans"
      >
        &larr; Voltar para o Dashboard
      </button>

      {/* Container Principal (Layout idêntico ao seu design) */}
      <section className="rounded-xl bg-[#2A2D32] p-4 md:p-8 shadow-lg border border-gray-700/50">
        
        <div className="flex flex-col gap-6 md:flex-row">
          
          {/* COLUNA ESQUERDA (IMAGEM DO JOGO) */}
          <div className="w-full md:w-1/3">
            <Image 
              src={game.image.medium_url} 
              alt={game.name} 
              width={500}
              height={600}
              className="w-full h-auto rounded-lg object-cover" 
            />
          </div>
          
          {/* COLUNA DIREITA (NOME, DESCRIÇÃO, REVIEW) */}
          <div className="flex-1">
            <h1 className="mb-2 text-4xl font-bold text-white font-pixel">
              {game.name}
            </h1>
            <p className="mb-6 text-sm text-gray-400 font-sans max-h-40 overflow-y-auto">
              {game.deck}
            </p>
            
            {/* Caixa de Review (com o gráfico bonito) */}
            <div className="rounded-lg bg-gray-900 border border-gray-700 p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-semibold text-white font-pixel">Meu Review</h3>
                {averageScore !== null && (
                  <h2 className="text-4xl font-bold text-lime-400 font-pixel">
                    {averageScore.toFixed(1)}
                  </h2>
                )}
              </div>
              
              <hr className="my-4 border-gray-700" />
              
              {/* O "Gráfico de Barras" Bonito */}
              {(Object.keys(review) as Array<keyof ReviewForm>).map((key) => (
                <div key={key} className="mb-4">
                  <label className="mb-2 block text-sm capitalize text-gray-300 font-sans">
                    {key}: <span className="font-bold text-white">{review[key]}</span>
                  </label>
                  
                  <div className="relative h-5 w-full">
                    {/* Camada 1: O fundo (a barra vazia) */}
                    <div className="absolute top-1/2 -translate-y-1/2 w-full h-2 bg-gray-700 rounded-full"></div>
                    
                    {/* Camada 2: O preenchimento (a barra verde) */}
                    <div 
                      className="absolute top-1/2 -translate-y-1/2 h-2 bg-lime-400 rounded-full transition-all duration-150"
                      style={{ width: `${review[key] * 10}%` }} // (valor / 10) * 100%
                    ></div>
                    
                    {/* Camada 3: O slider real (invisível mas funcional) */}
                    <input
                      type="range" 
                      name={key} 
                      min="0" 
                      max="10" 
                      step="0.5"
                      value={review[key]} 
                      onChange={handleReviewChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                </div>
              ))}
              
              <button 
                onClick={handleSubmitReview}
                className="mt-4 w-full rounded-md bg-lime-400 px-6 py-3 font-bold text-black transition-all hover:bg-lime-300 font-pixel text-lg"
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
    </main>
  );
}
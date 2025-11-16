// Caminho do arquivo: frontend/app/game/[id]/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';

// --- TIPOS (O seu código, sem mudanças) ---
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

// --- COMPONENTE DO GRÁFICO CIRCULAR (O seu código, sem mudanças) ---
function CircularProgress({ value, max, size = 60, strokeWidth = 8, color = '#84CC16', label }: {
  value: number;
  max: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string; 
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / max) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        {/* Círculo de fundo */}
        <circle
          stroke="#4B5563"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        {/* Círculo de progresso */}
        <circle
          stroke={color}
          fill="transparent"
          strokeWidth={strokeWidth}
          r={radius}
          cx={size / 2}
          cy={size / 2}
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: offset,
            transition: 'stroke-dashoffset 0.35s ease-out',
          }}
          strokeLinecap="round"
        />
      </svg>
      {label && (
        <span className="absolute text-white text-xs font-pixel -mt-2">
            {/* Aqui pode ser um ícone ou o label do texto */}
        </span>
      )}
    </div>
  );
}


// --- PÁGINA DE AVALIAÇÃO DO JOGO (O seu código, sem mudanças) ---
export default function GameReviewPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [game, setGame] = useState<GameDetails | null>(null);
  const [review, setReview] = useState<ReviewForm>(defaultReviewState);
  const [averageScore, setAverageScore] = useState<number | null>(5.0);
  const [reviewStatus, setReviewStatus] = useState(''); 
  const [isLoading, setIsLoading] = useState(true);

  const reviewLabels: { [key in keyof ReviewForm]: { label: string; icon: JSX.Element } } = {
    jogabilidade: { 
      label: 'JOGABILIDADE', 
      icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" /></svg>
    },
    graficos: { 
      label: 'GRÁFICOS', 
      icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75L12 15.75m0 0l-1.5 6m1.5-6l1.5 6M20.25 15.75L12 15.75m0 0l1.5 6m-1.5-6l-1.5 6M12 9.75a3 3 0 1 1 0 6 3 3 0 0 1 0-6Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M22.5 10.5l-2.25-2.25M2.25 10.5L4.5 8.25m8.25 12l2.25 2.25m-8.25-2.25L9.75 22.5M7.5 15.75a4.5 4.5 0 0 0 1.257 3.375C10.507 20.73 12 22.5 12 22.5s1.493-1.77 3.243-3.375a4.5 4.5 0 0 0 1.257-3.375V15.75L12 9.75l-4.5 6z" /></svg>
    },
    narrativa: { 
      label: 'NARRATIVA', 
      icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0112 20.25c.834 0 1.65-.147 2.416-.413l.002-.001 2.597-1.049A3.375 3.375 0 0016.5 16.25c0-.649-.182-1.24-.492-1.748L12 10.042" /><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.398a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75c0-1.216.455-2.356 1.22-3.22A4.486 4.486 0 0112 15c2.149 0 4.198.844 5.773 2.373" /></svg>
    },
    audio: { 
      label: 'ÁUDIO', 
      icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728m-1.75-2.1a5.25 5.25 0 0 0 0-7.538M9.375 4.5V19.5m0-4.5H1.5M9.375 9L1.5 4.5v15L9.375 15m10.5-11.25h.008v.008h-.008V2.25zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0z" /></svg>
    },
    desempenho: { 
      label: 'DESEMPENHO', 
      icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L13.5 21.75 15 13.5H3.75z" /></svg>
    },
  };

  useEffect(() => {
    if (!id) return;
    const loadGameData = async () => {
      setIsLoading(true);
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
  }, [id]);

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
  
  if (isLoading || !game) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="font-pixel text-2xl">Carregando Jogo...</p>
      </main>
    );
  }

  // --- MUDANÇA #1: FUNDO PARA IMAGEM (bg-black) ---
  return (
    <main className="relative min-h-screen text-white p-6 md:p-12 font-sans">
      
      {/* Imagem de Fundo (rate-bg.jpg) */}
      <Image
        src="/images/rate-bg.jpg" // A sua nova imagem
        alt="Fundo da página de avaliação"
        layout="fill"
        className="object-cover z-0 opacity-30" // Opacidade para legibilidade
      />
      
      {/* --- MUDANÇA #2: CONTEÚDO EM 'relative z-10' --- */}
      <div className="relative z-10"> 
      
        {/* Container (O seu balão 'max-w-5xl') */}
        <div className="relative border border-lime-400 p-4 md:p-8 lg:p-12 rounded-lg 
                        max-w-5xl mx-auto bg-[#1a1c1f] shadow-lg">
          
          {/* Detalhes do jogo (Sem mudanças) */}
          <div className="flex flex-col md:flex-row gap-8 mb-8">
            <div className="md:w-1/2">
              <h1 className="text-4xl lg:text-5xl font-pixel text-lime-400 tracking-wider mb-4">
                {game.name.toUpperCase()}
              </h1>
              <p className="text-gray-300 text-sm max-h-48 overflow-y-auto pr-2">
                <span className="font-pixel text-lime-400 text-base block mb-2">DESCRIPTION</span>
                {game.deck}
              </p>
            </div>
            
            <div className="md:w-1/2 flex justify-center items-center">
              <Image 
                src={game.image.medium_url} 
                alt={game.name} 
                width={600}
                height={350}
                className="w-full h-auto object-cover rounded-lg border border-gray-700" 
              />
            </div>
          </div>

          <div className="h-px bg-gray-700 my-8"></div>

          {/* SECÇÃO DE REVIEW (OS GRÁFICOS) */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
            
            {/* --- MUDANÇA #3: GRÁFICOS CORRIGIDOS (O seu código) --- */}
            <div className="w-full lg:w-1/2 grid grid-cols-2 gap-x-8 gap-y-10">
              {(Object.keys(review) as Array<keyof ReviewForm>).map((key) => (
                
                <div key={key} className="flex flex-col items-center gap-3">
                  
                  <div className="relative flex items-center justify-center" style={{ width: 100, height: 100 }}>
                    <CircularProgress 
                      value={review[key]} 
                      max={10} 
                      size={100} 
                      strokeWidth={10} 
                      color="#84CC16" 
                    />
                    <div className="absolute flex flex-col items-center justify-center text-gray-300 pointer-events-none">
                      {reviewLabels[key].icon}
                      <span className="text-xs font-pixel mt-1 text-lime-300">{review[key]}</span>
                    </div>
                  </div>
                  
                  <input
                    type="range" 
                    name={key} 
                    min="0" 
                    max="10" 
                    step="0.5"
                    value={review[key]} 
                    onChange={handleReviewChange}
                    className="w-full h-2 accent-lime-400 cursor-pointer"
                  />

                  <span className="text-sm font-pixel text-gray-400">
                    {reviewLabels[key].label}
                  </span>
                </div>
              ))}
            </div>

            {/* COLUNA DIREITA: GRÁFICO GERAL (Sem mudanças) */}
            <div className="w-full lg:w-1/2 flex flex-col items-center justify-center mt-10 lg:mt-0">
              <div className="relative flex items-center justify-center mb-8">
                <CircularProgress 
                  value={averageScore || 0} 
                  max={10} 
                  size={200} 
                  strokeWidth={15}
                  color="#84CC16" 
                />
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-7xl font-pixel text-lime-400">
                    {averageScore !== null ? averageScore.toFixed(1) : 'N/A'}
                  </span>
                  <span className="text-lg font-pixel text-gray-400 mt-2">
                    AVERAGE RATING
                  </span>
                </div>
              </div>
              
              <button 
                onClick={handleSubmitReview}
                className="mt-6 w-full max-w-xs rounded-md bg-lime-400 px-6 py-3 font-bold text-black transition-all hover:bg-lime-300 font-pixel text-lg"
              >
                SALVAR REVIEW
              </button>
              <p className={`mt-3 text-center text-sm font-sans ${reviewStatus.includes('Erro') ? 'text-red-400' : 'text-lime-400'}`}>
                {reviewStatus}
              </p>
            </div>

          </div>

          {/* Botão Voltar (Sem mudanças) */}
          <button 
            onClick={() => router.push('/dashboard')} 
            className="absolute bottom-4 left-4 rounded-md bg-gray-800 px-4 py-2 text-sm text-gray-300 transition-all hover:bg-gray-700 font-pixel"
          >
            &larr; VOLTAR
          </button>

        </div>
        
      </div> {/* --- FIM DO 'div' z-10 --- */}
    </main>
  );
}
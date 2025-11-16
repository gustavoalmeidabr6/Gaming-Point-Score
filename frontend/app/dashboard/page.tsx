// Caminho do arquivo: frontend/app/dashboard/page.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';

// --- ESTE É O NOVO HEADER (SIMPLES) ---
// (Não tem mais o banner, como na sua imagem 'image_01c2bb.png')
function DashboardHeader() {
  return (
    // Fundo cinza-azulado
    <header className="w-full bg-[#1E2024] border-b border-gray-700 py-4">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Ícone de Menu Verde */}
        <button className="p-2 rounded-md text-lime-green hover:bg-lime-green/10 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
        
        {/* Barra de Pesquisa */}
        <section className="flex-grow max-w-lg">
          <div className="relative">
            <input 
              type="text" 
              placeholder="PESQUISAR JOGOS..." 
              className="
                w-full rounded-full border border-gray-700
                bg-[#2A2D32] px-6 py-3 
                font-pixel tracking-wider text-white placeholder-gray-500
                focus:border-lime-400 focus:outline-none focus:ring-1 focus:ring-lime-400"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2
              rounded-full bg-lime-400 p-2.5
              text-black transition-all hover:bg-lime-300">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </button>
          </div>
        </section>

        {/* Espaço vazio à direita para equilibrar o menu */}
        <div className="w-12 h-8"></div> 
      </div>
    </header>
  );
}

// --- PÁGINA PRINCIPAL DO DASHBOARD ---
export default function DashboardPage() {
  // (Removemos a lógica de busca por agora, focando no layout)

  return (
    // Fundo principal (o mais escuro)
    <main className="min-h-screen bg-gray-900 text-white">
      
      {/* 1. CABEÇALHO (MENU + PESQUISA) */}
      <DashboardHeader />

      {/* 2. SECÇÃO DO "POD" DE PERFIL */}
      <section className="w-full bg-[#1E2024] py-10"> {/* Fundo cinza-azulado */}
        <div className="relative mx-auto w-[600px] h-[100px]"> {/* Tamanho do seu novo pod */}
          
          {/* A IMAGEM DO NOVO POD */}
          <Image
            src="/images/pod-background.png" //
            alt="Fundo do perfil"
            layout="fill"
            objectFit="contain"
            className="z-10"
          />

          {/* O CONTEÚDO (Avatar, Nível, Nome) */}
          <div className="absolute inset-0 z-20 flex items-center justify-between px-8">
            
            {/* Esquerda (Nível) */}
            <div className="flex items-center gap-3">
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

            {/* Centro (Avatar - posicionado no meio) */}
            {/* O '-mt-16' "puxa" o avatar para cima, para o centro do círculo */}
            <div className="w-[100px] h-[100px] rounded-full -mt-16">
              <Image 
                src="/images/placeholder-avatar.jpg" //
                alt="Foto de Perfil"
                width={100} 
                height={100}
                className="rounded-full object-cover border-4 border-gray-900"
              />
            </div>

            {/* Direita (Nome) */}
            <div>
              <h1 className="font-pixel text-3xl font-bold text-white">
                NOME
              </h1>
            </div>

          </div>
        </div>
      </section>
      
      {/* 3. SECÇÃO DE JOGOS (FUNDO MAIS ESCURO) */}
      <div className="w-full bg-gray-900 pt-10">
        <div className="mx-auto max-w-6xl px-4 pb-20 sm:px-6 lg:px-8">
          
          <section>
            <h2 className="mb-6 text-3xl font-bold text-white font-pixel tracking-wider">
              JOGOS RELEVANTES
            </h2>
            <div className="grid grid-cols-4 gap-8 md:grid-cols-4">
              {[...Array(8)].map((_, i) => (
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
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
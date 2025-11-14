// Caminho: frontend/tailwind.config.ts
import type { Config } from 'tailwindcss';
import { fontFamily } from 'tailwindcss/defaultTheme'; 

const config: Config = {
  
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  
  theme: {
    extend: {
      // --- É ISTO QUE CORRIGE A FONTE ---
      fontFamily: {
        sans: ['var(--font-inter)', ...fontFamily.sans],
        // 1. MUDÁMOS DE 'jersey' PARA 'pixel' e apontámos para a nova variável
        pixel: ['var(--font-pixel)', 'sans-serif'],
      },
      // --- FIM DA CORREÇÃO ---

      colors: {
        'lime-green': '#3bbe5d', 
      },
    },
  },

  plugins: [],

};

export default config;
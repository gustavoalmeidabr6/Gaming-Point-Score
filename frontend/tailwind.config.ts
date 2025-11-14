// Caminho: frontend/tailwind.config.ts
import type { Config } from 'tailwindcss';

// Esta é a sintaxe correta para o Tailwind v3
const config: Config = {
  
  // O 'content' fica aqui
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  
  // O 'theme' fica no nível principal
  theme: {
    extend: {
      colors: {
        'lime-green': '#3bbe5d', // A sua cor verde
      },
    },
  },

  // O 'plugins' também fica no nível principal
  plugins: [],

};

export default config;
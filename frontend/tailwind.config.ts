// Caminho: frontend/tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}', 
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Adicione esta secção:
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'], // 'sans' é a fonte padrão
        jersey: ['var(--font-jersey)', 'sans-serif'], // 'jersey' é a fonte de título
      },
      // (Podemos adicionar as cores verde-limão aqui mais tarde)
    },
  },
  plugins: [],
};
export default config;
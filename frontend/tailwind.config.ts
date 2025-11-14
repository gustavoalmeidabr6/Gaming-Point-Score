// Caminho: frontend/tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}', 
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Deixe esta secção 'extend' vazia por agora
    },
  },
  plugins: [],
};
export default config;
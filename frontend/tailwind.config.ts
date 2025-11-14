// Caminho: frontend/tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}', 
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Adicione esta secção de cores:
      colors: {
        'lime-green': '#3bbe5d', // A sua cor verde principal
      }
    },
  },
  plugins: [],
};
export default config;
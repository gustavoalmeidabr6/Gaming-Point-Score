// Caminho: frontend/tailwind.config.ts
import type { Config } from 'tailwindcss';

// A sintaxe do v4 usa "export default" diretamente
export default {
  
  // O 'content' fica aqui
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  
  // A sintaxe v4 move 'theme' e 'plugins' para dentro de um objeto 'config'
  config: {
    theme: {
      extend: {
        colors: {
          'lime-green': '#3bbe5d', // A sua cor verde do Figma
        },
      },
    },
    plugins: [],
  },

} satisfies Config; // 'satisfies Config' é a nova forma de tipagem
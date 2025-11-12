import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    // --- !!! AQUI ESTÁ A CORREÇÃO !!! ---
    // Removemos o './src/' da frente dos caminhos.
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}', // (Para o futuro)
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
export default config;
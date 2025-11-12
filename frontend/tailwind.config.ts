import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}', // Diz ao Tailwind para olhar todas as nossas páginas
    './src/components/**/*.{js,ts,jsx,tsx,mdx}', // (Para o futuro)
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
export default config;
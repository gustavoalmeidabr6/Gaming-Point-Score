/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // --- ADICIONE ISTO ---
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.giantbomb.com',
        port: '',
        pathname: '/a/uploads/**', // O caminho padrão das imagens da API
      },
    ],
  },
  // --- FIM DA ADIÇÃO ---
};

module.exports = nextConfig;
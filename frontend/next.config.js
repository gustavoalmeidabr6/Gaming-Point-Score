/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // --- MUDANÇA AQUI: Autoriza imagens da Giant Bomb ---
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
  // --- FIM DA MUDANÇA ---
};

module.exports = nextConfig;
module.exports = {
  plugins: {
    // AQUI ESTÁ A CORREÇÃO:
    // Nós dizemos a ele para usar o pacote que instalamos
    '@tailwindcss/postcss': {},
    // 'autoprefixer' já está incluído no v4, então não precisamos dele aqui.
  },
}
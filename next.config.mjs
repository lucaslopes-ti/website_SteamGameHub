/** @type {import('next').NextConfig} */
const nextConfig = {
  // Otimizações para produção
  reactStrictMode: true,
  swcMinify: true,
  
  // Configurações para uploads grandes
  experimental: {
    serverActions: {
      bodySizeLimit: '500mb',
    },
  },

  // Monaco Editor (empacotado localmente em SqlEditor.tsx): o arquivo do web
  // worker do Monaco é ESM puro e o minificador (Terser/SWC do Next) falha ao
  // tratá-lo como script clássico ("import cannot be used outside module
  // code"). Um plugin marca o chunk do worker como "já minimizado"
  // (info.minimized) para que o minificador do Next o ignore; o webpack segue
  // empacotando o worker como chunk filho, com suas dependências resolvidas.
  webpack: (config) => {
    if (config.optimization && Array.isArray(config.optimization.minimizer)) {
      config.optimization.minimizer.unshift((compiler) => {
        compiler.hooks.compilation.tap('skip-monaco-worker-minify', (compilation) => {
          compilation.hooks.processAssets.tap(
            {
              name: 'skip-monaco-worker-minify',
              stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE - 1,
            },
            () => {
              for (const name of Object.keys(compilation.assets)) {
                if (!/editorWebWorkerMain/.test(name)) continue;
                const asset = compilation.getAsset(name);
                if (asset) {
                  compilation.updateAsset(name, asset.source, {
                    ...asset.info,
                    minimized: true,
                  });
                }
              }
            }
          );
        });
      });
    }
    return config;
  },

  // Configuração de imagens
  images: {
    unoptimized: true,
    domains: [
      'firebasestorage.googleapis.com',
      'localhost',
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.firebasestorage.googleapis.com',
      },
    ],
  },

  // Headers de segurança
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
        ],
      },
    ];
  },
};

export default nextConfig;


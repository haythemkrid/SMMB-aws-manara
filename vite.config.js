import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    allowedHosts: ['smmb-local.elb.localhost.localstack.cloud'],
    proxy: {
      '/api/requests': {
        target: 'http://localhost:4001',
        changeOrigin: false,
      },
      '/api': {
        target: 'http://smmb-local.elb.localhost.localstack.cloud:4566',
        changeOrigin: true,
        headers: {
          origin: '',
        },
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyRequest) => {
            proxyRequest.removeHeader('origin');
          });
        },
      },
    },
  },
});

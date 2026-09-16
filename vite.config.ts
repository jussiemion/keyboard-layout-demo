import tailwindcss from '@tailwindcss/postcss';
import vinext from 'vinext';
import { defineConfig } from 'vite';
import { styleText } from 'node:util';

// Fully static export: no server bindings, database, or hosted runtime.
export default defineConfig({
  base: `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/`,
  css: { postcss: { plugins: [tailwindcss()] } },
  plugins: [
    vinext(),
    {
      name: 'local-welcome',
      apply: 'serve',
      configureServer(server) {
        const printUrls = server.printUrls.bind(server);
        let announced = false;
        server.printUrls = () => {
          printUrls();
          if (announced) {
            return;
          }
          announced = true;
          server.config.logger.info(
            [
              '',
              styleText(['bold', 'yellow'], '  🚀 Typographic Layout'),
              '     by Semyon Yushkevich',
              '',
              styleText('green', '  ● Running locally'),
              '',
              '  ⭐ If you like it, please support the project with a Star:',
              '     https://github.com/jussiemion/keyboard-layout-demo',
              '',
              '  💬 Share your ideas or report bugs in Discussions!',
              '     https://github.com/jussiemion/keyboard-layout-demo/discussions',
              '',
            ].join('\n'),
          );
        };
      },
    },
  ],
  server: { host: '127.0.0.1', port: 6699, strictPort: true },
  preview: { host: '127.0.0.1', port: 6699, strictPort: true },
});

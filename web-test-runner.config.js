import { chromeLauncher } from '@web/test-runner-chrome';
import { esbuildPlugin } from '@web/dev-server-esbuild';

export default {
  files: 'src/__tests__/**/*.test.ts',
  nodeResolve: true,
  browsers: [chromeLauncher()],
  testFramework: {
    config: {
      timeout: 15000,
      ui: 'bdd',
    },
  },
  testsFinishTimeout: 60000,
  plugins: [
    esbuildPlugin({
      ts: true,
      tsconfig: 'tsconfig.json',
      target: 'auto',
    }),
    {
      name: 'markdown-mock',
      transform(context) {
        if (context.path.endsWith('.md')) {
          return {
            body: 'import { html } from "lit"; export default html`<p>Mock markdown content</p>`;',
            contentType: 'application/javascript',
          };
        }
      },
    },
  ],
};

import { Plugin } from 'vite';
import { marked } from 'marked';
import { codeToHtml } from 'shiki';

// Configure marked once globally to avoid adding renderers multiple times
marked.use({
  renderer: {
    async code(code: string, lang: string | undefined) {
      try {
        const highlighted = await codeToHtml(code, {
          lang: lang || 'text',
          theme: 'github-dark',
        });
        return `<code-block lang="${lang || 'text'}">${highlighted}</code-block>`;
      } catch (e) {
        return `<code-block lang="${lang || 'text'}"><pre><code>${code}</code></pre></code-block>`;
      }
    },
  },
});

export function markdownLitPlugin(): Plugin {
  return {
    name: 'vite-plugin-markdown-lit',
    async transform(code, id) {
      if (id.endsWith('.md')) {
        const htmlContent = await marked.parse(code) as string;
        
        const escapedContent = htmlContent.replace(/`/g, '\\`');
        return {
          code: `import { html } from 'lit';\nexport default html\`${escapedContent}\`;`,
          map: null,
        };
      }
      return null;
    },
  };
}

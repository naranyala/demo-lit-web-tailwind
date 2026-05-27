import { Plugin } from 'vite';
import { marked } from 'marked';
import { codeToHtml } from 'shiki';
import fs from 'node:fs';
import path from 'node:path';

export function markdownLitPlugin(): Plugin {
  return {
    name: 'vite-plugin-markdown-lit',
    async transform(code, id) {
      if (id.endsWith('.md')) {
        // 1. Resolve src="..." code blocks first
        const sourceBlockRegex = /```(\w+)?\s*src="([^"]+)"\n([\s\S]*?)\n```/g;
        let processedCode = code;
        const srcMatches = [...code.matchAll(sourceBlockRegex)];

        for (const match of srcMatches) {
          const [fullMatch, lang, srcPath] = match;
          try {
            const absolutePath = path.resolve(path.dirname(id), srcPath);
            const fileContent = fs.readFileSync(absolutePath, 'utf-8');
            processedCode = processedCode.replace(fullMatch, `\`\`\`${lang || 'ts'}\n${fileContent}\n\`\`\``);
          } catch (e) {
            console.error(`Could not read source file: ${srcPath}`);
          }
        }

        // 2. Pre-process fenced code blocks with Shiki.
        //    Replace each with a placeholder so marked never
        //    sees the HTML tags (it would split custom elements
        //    like <code-block> across paragraphs).
        const fenceRegex = /```(\w+)?\n([\s\S]*?)\n```/g;
        const replacements: [string, string][] = [];
        let placeholderIndex = 0;
        let fenceMatch: RegExpExecArray | null;

        while ((fenceMatch = fenceRegex.exec(processedCode)) !== null) {
          const [fullMatch, lang, content] = fenceMatch;
          const placeholder = `@@CODECOMP_${placeholderIndex}@@`;
          placeholderIndex++;

          try {
            const highlighted = await codeToHtml(content, {
              lang: lang || 'text',
              theme: 'github-dark',
            });
            replacements.push([placeholder, `<code-block lang="${lang || 'text'}">${highlighted}</code-block>`]);
          } catch {
            replacements.push([placeholder, `<code-block lang="${lang || 'text'}"><pre><code>${content}</code></pre></code-block>`]);
          }

          const wrappedPlaceholder = `<div>${placeholder}</div>`;
          processedCode = processedCode.slice(0, fenceMatch.index) + wrappedPlaceholder + processedCode.slice(fenceMatch.index + fullMatch.length);
          fenceRegex.lastIndex = fenceMatch.index + wrappedPlaceholder.length;
        }

        // 3. Convert remaining markdown to HTML
        const htmlContent = await marked.parse(processedCode) as string;

        // 4. Replace placeholders with actual code-block HTML
        const finalHtml = replacements.reduce(
          (html, [placeholder, codeBlockHtml]) => html.replace(placeholder, codeBlockHtml),
          htmlContent
        );

        const escapedContent = finalHtml.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\${/g, '\\${');

        return {
          code: `import { html } from 'lit';\nexport default html\`${escapedContent}\`;`,
          map: null,
        };
      }
      return null;
    },
  };
}

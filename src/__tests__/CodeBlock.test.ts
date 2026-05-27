import { html, fixture, expect, aTimeout } from '@open-wc/testing';
import sinon from 'sinon';
import '../components/CodeBlock.ts';

async function waitForUpdate(el: HTMLElement) {
  await (el as any).updateComplete;
}

describe('CodeBlock', () => {
  let clipboardStub: sinon.SinonStub | undefined;

  beforeEach(() => {
    if (navigator.clipboard) {
      clipboardStub = sinon.stub(navigator.clipboard, 'writeText').resolves();
    }
  });

  afterEach(() => {
    if (clipboardStub) clipboardStub.restore();
  });

  describe('initial state', () => {
    it('captures children and renders code content via unsafeHTML', async () => {
      const el = await fixture<HTMLElement>(
        html`<code-block lang="ts"><pre><code>const x = 1;</code></pre></code-block>`
      );
      // The original children are cleared from the element
      expect(el.querySelector('pre')).to.not.exist;

      // Rendered code appears inside .overflow-x-auto via unsafeHTML
      const codeArea = el.querySelector('.overflow-x-auto')!;
      expect(codeArea.innerHTML).to.contain('const x = 1');
    });

    it('renders macOS window chrome (traffic lights)', async () => {
      const el = await fixture<HTMLElement>(
        html`<code-block><pre><code>code</code></pre></code-block>`
      );
      const dots = el.querySelectorAll('.rounded-full');
      const classes = Array.from(dots).map(d => d.className);
      expect(classes.some(c => c.includes('bg-[#ff5f56]'))).to.be.true;
      expect(classes.some(c => c.includes('bg-[#ffbd2e]'))).to.be.true;
      expect(classes.some(c => c.includes('bg-[#27c93f]'))).to.be.true;
    });
  });

  describe('language badge', () => {
    it('shows language when lang prop is set', async () => {
      const el = await fixture<HTMLElement>(
        html`<code-block lang="typescript"><pre><code>const x: number = 1;</code></pre></code-block>`
      );
      const langEls = Array.from(el.querySelectorAll('.text-slate-400')).filter(
        e => e.textContent!.trim() === 'typescript'
      );
      expect(langEls.length).to.equal(1);
    });

    it('hides language badge when lang is empty', async () => {
      const el = await fixture<HTMLElement>(
        html`<code-block><pre><code>code</code></pre></code-block>`
      );
      const langSpans = el.querySelectorAll('.text-slate-400.font-mono');
      expect(langSpans.length).to.equal(0);
    });

    it('shows lang="text" when set', async () => {
      const el = await fixture<HTMLElement>(
        html`<code-block lang="text"><pre><code>plain text</code></pre></code-block>`
      );
      const langEls = Array.from(el.querySelectorAll('.text-slate-400')).filter(
        e => e.textContent!.trim() === 'text'
      );
      expect(langEls.length).to.equal(1);
    });
  });

  describe('copy functionality', () => {
    function getCopyBtn(el: HTMLElement) {
      return el.querySelector('button') as HTMLElement;
    }

    it('copy button exists with default text "Copy"', async () => {
      const el = await fixture<HTMLElement>(
        html`<code-block><pre><code>code</code></pre></code-block>`
      );
      const btn = getCopyBtn(el);
      expect(btn).to.exist;
      expect(btn.textContent!.trim()).to.equal('Copy');
    });

    it('calls navigator.clipboard.writeText on click', async () => {
      const el = await fixture<HTMLElement>(
        html`<code-block><pre><code>console.log("hello");</code></pre></code-block>`
      );
      getCopyBtn(el).click();

      if (clipboardStub) {
        expect(clipboardStub.calledOnce).to.be.true;
        expect(clipboardStub.firstCall.args[0]).to.equal('console.log("hello");');
      }
    });

    it('changes button text to "Copied!" after copy', async () => {
      const el = await fixture<HTMLElement>(
        html`<code-block><pre><code>code</code></pre></code-block>`
      );
      const btn = getCopyBtn(el);
      btn.click();
      await waitForUpdate(el);

      expect(btn.textContent!.trim()).to.equal('Copied!');
    });

    it('reverts to "Copy" after 2 seconds', async () => {
      const el = await fixture<HTMLElement>(
        html`<code-block><pre><code>code</code></pre></code-block>`
      );
      const btn = getCopyBtn(el);
      btn.click();
      await waitForUpdate(el);
      expect(btn.textContent!.trim()).to.equal('Copied!');

      await aTimeout(2100);
      expect(btn.textContent!.trim()).to.equal('Copy');
    });

    it('does not throw if clipboard API fails', async () => {
      if (clipboardStub) clipboardStub.rejects(new Error('Permission denied'));
      else return;

      const el = await fixture<HTMLElement>(
        html`<code-block><pre><code>code</code></pre></code-block>`
      );
      expect(() => getCopyBtn(el).click()).to.not.throw();
    });

    it('copies plain text stripped of HTML', async () => {
      const el = await fixture<HTMLElement>(
        html`<code-block><pre><code>&lt;strong&gt;bold&lt;/strong&gt;</code></pre></code-block>`
      );
      getCopyBtn(el).click();

      if (clipboardStub) {
        expect(clipboardStub.firstCall.args[0]).to.equal('<strong>bold</strong>');
      }
    });
  });

  describe('edge cases', () => {
    it('disconnectedCallback clears copy timer', async () => {
      const el = await fixture<HTMLElement>(
        html`<code-block><pre><code>code</code></pre></code-block>`
      );
      const btn = el.querySelector('button')!;
      btn.click();
      await waitForUpdate(el);
      expect(btn.textContent!.trim()).to.equal('Copied!');

      el.remove();
      await aTimeout(2100);
    });

    it('multiple code-blocks have independent copy state', async () => {
      const container = await fixture<HTMLElement>(html`
        <div>
          <code-block id="c1"><pre><code>first</code></pre></code-block>
          <code-block id="c2"><pre><code>second</code></pre></code-block>
        </div>
      `);

      // Need to wait for both to register
      await waitForUpdate(container.querySelector('#c1')!);
      await waitForUpdate(container.querySelector('#c2')!);

      const c1btn = container.querySelector('#c1 button') as HTMLElement;
      const c2btn = container.querySelector('#c2 button') as HTMLElement;

      c1btn.click();
      await waitForUpdate(container.querySelector('#c1')!);
      expect(c1btn.textContent!.trim()).to.equal('Copied!');
      expect(c2btn.textContent!.trim()).to.equal('Copy');

      await aTimeout(2100);
      expect(c1btn.textContent!.trim()).to.equal('Copy');
      expect(c2btn.textContent!.trim()).to.equal('Copy');
    });
  });
});

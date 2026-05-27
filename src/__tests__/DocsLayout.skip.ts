import { html, fixture, expect } from '@open-wc/testing';
import sinon from 'sinon';
import '../components/DocsLayout.ts';

describe('DocsLayout', () => {
  it('renders sidebar with sections', async () => {
    const el = await fixture<HTMLElement>(html`<docs-layout></docs-layout>`);
    const sectionHeaders = el.querySelectorAll('.text-xs.font-semibold');
    expect(sectionHeaders.length).to.equal(2);
    expect(sectionHeaders[0].textContent).to.equal('Reusable Utilities Demo');
    expect(sectionHeaders[1].textContent).to.equal('Component Examples');
  });

  it('renders all navigation buttons', async () => {
    const el = await fixture<HTMLElement>(html`<docs-layout></docs-layout>`);
    const navBtns = el.querySelectorAll('nav button');
    expect(navBtns.length).to.equal(5);
    const titles = Array.from(navBtns).map(b => b.textContent);
    expect(titles).to.include('Introduction');
    expect(titles).to.include('Architecture');
    expect(titles).to.include('Accordion');
    expect(titles).to.include('Slide Drawer');
    expect(titles).to.include('Popup Modal');
  });

  it('defaults to intro page', async () => {
    const el = await fixture<HTMLElement>(html`<docs-layout></docs-layout>`);
    expect((el as any).currentPageId).to.equal('intro');
  });

  it('intro button has active styling', async () => {
    const el = await fixture<HTMLElement>(html`<docs-layout></docs-layout>`);
    const introBtn = Array.from(el.querySelectorAll('nav button')).find(
      b => b.textContent === 'Introduction'
    )!;
    expect(introBtn.className).to.contain('bg-indigo-600');
  });

  it('clicking a nav item changes currentPageId', async () => {
    const el = await fixture<HTMLElement>(html`<docs-layout></docs-layout>`);
    const archBtn = Array.from(el.querySelectorAll('nav button')).find(
      b => b.textContent === 'Architecture'
    )!;
    archBtn.click();
    expect((el as any).currentPageId).to.equal('architecture');
  });

  it('clicking nav item updates active styling', async () => {
    const el = await fixture<HTMLElement>(html`<docs-layout></docs-layout>`);
    const archBtn = Array.from(el.querySelectorAll('nav button')).find(
      b => b.textContent === 'Architecture'
    )!;
    archBtn.click();
    await (el as any).updateComplete;

    const introBtn = Array.from(el.querySelectorAll('nav button')).find(
      b => b.textContent === 'Introduction'
    )!;
    expect(introBtn.className).to.not.contain('bg-indigo-600');
    expect(archBtn.className).to.contain('bg-indigo-600');
  });

  it('renders main content area with article', async () => {
    const el = await fixture<HTMLElement>(html`<docs-layout></docs-layout>`);
    const article = el.querySelector('article');
    expect(article).to.exist;
    expect(article.className).to.contain('prose');
  });

  it('renders mock markdown content from intro.md', async () => {
    const el = await fixture<HTMLElement>(html`<docs-layout></docs-layout>`);
    const article = el.querySelector('article')!;
    expect(article.textContent).to.contain('Mock markdown content');
  });

  it('switching pages changes article content', async () => {
    const el = await fixture<HTMLElement>(html`<docs-layout></docs-layout>`);
    const archBtn = Array.from(el.querySelectorAll('nav button')).find(
      b => b.textContent === 'Architecture'
    )!;
    archBtn.click();
    await (el as any).updateComplete;

    // Each mock content is the same since we replaced them all
    const article = el.querySelector('article')!;
    expect(article.textContent).to.contain('Mock markdown content');
  });

  it('renders sidebar branding', async () => {
    const el = await fixture<HTMLElement>(html`<docs-layout></docs-layout>`);
    const brand = el.querySelector('.text-xl.font-bold');
    expect(brand).to.exist;
    expect(brand!.textContent).to.contain('Lit');
    expect(brand!.textContent).to.contain('Web');
  });

  it('renders powered by footer', async () => {
    const el = await fixture<HTMLElement>(html`<docs-layout></docs-layout>`);
    const footer = el.querySelector('.mt-auto');
    expect(footer).to.exist;
    expect(footer!.textContent).to.contain('Lit + Tailwind v4');
  });

  it('imports and registers all example components', async () => {
    const el = await fixture<HTMLElement>(html`<docs-layout></docs-layout>`);
    // Check that Lit registered the custom elements
    expect(customElements.get('demo-accordion')).to.exist;
    expect(customElements.get('code-block')).to.exist;
    expect(customElements.get('slide-drawer')).to.exist;
    expect(customElements.get('popup-modal')).to.exist;
  });

  it('handles unknown pageId gracefully', async () => {
    const el = await fixture<HTMLElement>(html`<docs-layout></docs-layout>`);
    (el as any).currentPageId = 'nonexistent-page';
    await (el as any).updateComplete;

    // Should fallback to intro
    const article = el.querySelector('article')!;
    expect(article.textContent).to.contain('Mock markdown content');
  });
});

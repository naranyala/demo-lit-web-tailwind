import { html, fixture, expect } from '@open-wc/testing';
import '../components/DemoAccordion.ts';

async function waitForUpdate(el: HTMLElement) {
  await (el as any).updateComplete;
}

describe('DemoAccordion', () => {
  describe('initial state', () => {
    it('renders items from child elements with title attribute', async () => {
      const el = await fixture<HTMLElement>(html`
        <demo-accordion>
          <div title="Section A">Content A</div>
          <div title="Section B">Content B</div>
        </demo-accordion>
      `);
      const titles = el.querySelectorAll('.font-medium');
      expect(titles.length).to.equal(2);
      expect(titles[0].textContent).to.equal('Section A');
      expect(titles[1].textContent).to.equal('Section B');
    });

    it('starts with index=0 (first item open by default)', async () => {
      const el = await fixture<HTMLElement>(html`
        <demo-accordion>
          <div title="A">Content A</div>
          <div title="B">Content B</div>
        </demo-accordion>
      `);
      expect((el as any).index).to.equal(0);
    });

    it('first item content visible via grid-template-rows: 1fr', async () => {
      const el = await fixture<HTMLElement>(html`
        <demo-accordion>
          <div title="A">Content A</div>
          <div title="B">Content B</div>
        </demo-accordion>
      `);
      const panels = el.querySelectorAll('[style*="grid-template-rows"]') as NodeListOf<HTMLElement>;
      expect(panels.length).to.equal(2);
      expect(panels[0].style.gridTemplateRows).to.equal('1fr');
      expect(panels[1].style.gridTemplateRows).to.equal('0fr');
    });

    it('clears innerHTML after capturing children', async () => {
      const el = await fixture<HTMLElement>(html`
        <demo-accordion>
          <div title="A">Content A</div>
        </demo-accordion>
      `);
      const originalDivs = Array.from(el.children).filter(
        c => c.tagName === 'DIV' && c.getAttribute('title')
      );
      expect(originalDivs.length).to.equal(0);
    });

    it('skips empty children', async () => {
      const el = await fixture<HTMLElement>(html`
        <demo-accordion>
          <div title="A">Content A</div>
          <div title="B"></div>
          <div title="C">Content C</div>
        </demo-accordion>
      `);
      const titles = el.querySelectorAll('.font-medium');
      expect(titles.length).to.equal(2);
    });
  });

  describe('interaction', () => {
    it('clicking a closed item opens it', async () => {
      const el = await fixture<HTMLElement>(html`
        <demo-accordion>
          <div title="A">Content A</div>
          <div title="B">Content B</div>
        </demo-accordion>
      `);
      const headers = el.querySelectorAll('.cursor-pointer');
      (headers[1] as HTMLElement).click();
      await waitForUpdate(el);

      const panels = el.querySelectorAll('[style*="grid-template-rows"]') as NodeListOf<HTMLElement>;
      expect((el as any).index).to.equal(1);
      expect(panels[0].style.gridTemplateRows).to.equal('0fr');
      expect(panels[1].style.gridTemplateRows).to.equal('1fr');
    });

    it('clicking the open item closes it (index = -1)', async () => {
      const el = await fixture<HTMLElement>(html`
        <demo-accordion>
          <div title="A">Content A</div>
          <div title="B">Content B</div>
        </demo-accordion>
      `);
      const headers = el.querySelectorAll('.cursor-pointer');
      (headers[0] as HTMLElement).click();
      await waitForUpdate(el);

      expect((el as any).index).to.equal(-1);
      const panels = el.querySelectorAll('[style*="grid-template-rows"]') as NodeListOf<HTMLElement>;
      expect(panels[0].style.gridTemplateRows).to.equal('0fr');
      expect(panels[1].style.gridTemplateRows).to.equal('0fr');
    });

    it('only one item open at a time', async () => {
      const el = await fixture<HTMLElement>(html`
        <demo-accordion>
          <div title="A">Content A</div>
          <div title="B">Content B</div>
          <div title="C">Content C</div>
        </demo-accordion>
      `);
      const headers = el.querySelectorAll('.cursor-pointer');

      // Open B
      (headers[1] as HTMLElement).click();
      await waitForUpdate(el);
      expect((el as any).index).to.equal(1);

      // Open C
      (headers[2] as HTMLElement).click();
      await waitForUpdate(el);
      expect((el as any).index).to.equal(2);

      const panels = el.querySelectorAll('[style*="grid-template-rows"]') as NodeListOf<HTMLElement>;
      expect(panels[0].style.gridTemplateRows).to.equal('0fr');
      expect(panels[1].style.gridTemplateRows).to.equal('0fr');
      expect(panels[2].style.gridTemplateRows).to.equal('1fr');
    });
  });

  describe('rendering details', () => {
    it('chevron rotates 180deg for open item', async () => {
      const el = await fixture<HTMLElement>(html`
        <demo-accordion>
          <div title="A">Content A</div>
          <div title="B">Content B</div>
        </demo-accordion>
      `);
      const chevrons = el.querySelectorAll('svg');
      expect(chevrons[0].classList.contains('rotate-180')).to.be.true;
      expect(chevrons[1].classList.contains('rotate-180')).to.be.false;
    });

    it('last item inner wrapper has no border-b class', async () => {
      const el = await fixture<HTMLElement>(html`
        <demo-accordion>
          <div title="A">Content A</div>
          <div title="B">Content B</div>
        </demo-accordion>
      `);
      // The outermost container only, without the child. We check that the last
      // child of the wrapper div does NOT have border-b border-slate-200.
      const wrapper = el.querySelector('.border');
      const innerWrappers = wrapper!.querySelectorAll(':scope > div');
      expect(innerWrappers.length).to.equal(2);

      // First item should have border-b, second should not
      const firstHasBorder = innerWrappers[0].className.includes('border-b');
      const lastHasBorder = innerWrappers[1].className.includes('border-b');
      expect(firstHasBorder).to.be.true;
      expect(lastHasBorder).to.be.false;
    });

    it('content is rendered via unsafeHTML (supports HTML)', async () => {
      const el = await fixture<HTMLElement>(html`
        <demo-accordion>
          <div title="A"><strong>Bold</strong> and <em>italic</em></div>
        </demo-accordion>
      `);
      const contentArea = el.querySelector('.bg-slate-50\\/50')!;
      expect(contentArea.innerHTML).to.contain('<strong>Bold</strong>');
      expect(contentArea.innerHTML).to.contain('<em>italic</em>');
    });
  });

  describe('edge cases', () => {
    it('single item accordion toggles correctly', async () => {
      const el = await fixture<HTMLElement>(html`
        <demo-accordion>
          <div title="Only">Solo content</div>
        </demo-accordion>
      `);
      expect((el as any).index).to.equal(0);

      (el.querySelector('.cursor-pointer') as HTMLElement)!.click();
      await waitForUpdate(el);
      expect((el as any).index).to.equal(-1);

      (el.querySelector('.cursor-pointer') as HTMLElement)!.click();
      await waitForUpdate(el);
      expect((el as any).index).to.equal(0);
    });

    it('programmatic index change works', async () => {
      const el = await fixture<HTMLElement>(html`
        <demo-accordion>
          <div title="A">A</div>
          <div title="B">B</div>
          <div title="C">C</div>
        </demo-accordion>
      `);
      (el as any).index = 2;
      await waitForUpdate(el);

      const panels = el.querySelectorAll('[style*="grid-template-rows"]') as NodeListOf<HTMLElement>;
      expect(panels[0].style.gridTemplateRows).to.equal('0fr');
      expect(panels[1].style.gridTemplateRows).to.equal('0fr');
      expect(panels[2].style.gridTemplateRows).to.equal('1fr');
    });

    it('does not re-capture children on reconnect', async () => {
      const parent = await fixture<HTMLElement>(html`<div></div>`);
      const el = document.createElement('demo-accordion');
      el.innerHTML = '<div title="A">Content</div>';
      parent.appendChild(el);
      await (el as any).updateComplete;

      const titlesBefore = el.querySelectorAll('.font-medium');
      expect(titlesBefore.length).to.equal(1);

      // Remove and re-add
      parent.removeChild(el);
      parent.appendChild(el);
      await (el as any).updateComplete;

      const titlesAfter = el.querySelectorAll('.font-medium');
      expect(titlesAfter.length).to.equal(1);
    });
  });
});

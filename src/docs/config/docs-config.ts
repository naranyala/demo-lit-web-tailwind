import introContent from '../../docs/intro.md';
import archContent from '../../docs/architecture.md';
import accordionEx from '../../docs/examples/accordion.md';
import slideDrawerEx from '../../docs/examples/slide-drawer.md';
import popupModalEx from '../../docs/examples/popup-modal.md';

// Components to register
import '../../components/DemoAccordion.ts';
import '../../components/CodeBlock.ts';
import '../../components/SlideDrawer.ts';
import '../../components/PopupModal.ts';
import '../../components/ControllerDemo.ts';

export interface PageConfig {
  id: string;
  title: string;
  content: any;
  component: string;
}

export interface SectionConfig {
  name: string;
  pages: PageConfig[];
}

export const DOCS_CONFIG: SectionConfig[] = [
  {
    name: 'Welcome',
    pages: [
      { id: 'intro', title: 'Welcome Dashboard', content: introContent, component: 'doc-page' },
    ]
  },
  {
    name: 'Reusable Utilities Demo',
    pages: [
      { id: 'architecture', title: 'Architecture', content: archContent, component: 'doc-page' },
      { id: 'composables', title: 'Composables Demo', content: '', component: 'controller-demo' },
    ]
  },
  {
    name: 'Component Examples',
    pages: [
      { id: 'accordion', title: 'Accordion', content: accordionEx, component: 'doc-page' },
      { id: 'slide-drawer', title: 'Slide Drawer', content: slideDrawerEx, component: 'doc-page' },
      { id: 'popup-modal', title: 'Popup Modal', content: popupModalEx, component: 'doc-page' },
    ]
  }
];



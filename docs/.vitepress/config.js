import './services/initialization';
import mathjax3 from 'markdown-it-mathjax3';
import themeConfig from './config/themeConfig';

const customElements = ['mjx-container', 'mo', 'math', 'mn', 'mi', 'mjx-assistive-mml', 'mrow'];

const config = {
  lang: 'zh-CN',
  title: '得時笔记',
  description: '记录工作，计算机技术',
  lastUpdated: true,
  themeConfig,
  head: [
    ['link', { rel: 'stylesheet', href: '/style/global.css' }],
    ['script', { src: '/js/global.js' }],
  ],
  markdown: {
    lineNumbers: true,
    config: md => {
      // use more markdown-it plugins!
      md.use(mathjax3);
    },
  },
  vue: {
    template: {
      compilerOptions: {
        isCustomElement: tag => customElements.includes(tag),
      },
    },
  },
};

export default config;

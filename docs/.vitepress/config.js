// import { SearchPlugin } from 'vitepress-plugin-search';

import './init';
import mathjax3 from 'markdown-it-mathjax3';
import themeConfig from './config/themeConfig';

const customElements = ['mjx-container', 'mo', 'math', 'mn', 'mi', 'mjx-assistive-mml', 'mrow'];

// default options
// var searchOptions = {
//   previewLength: 62,
//   buttonLabel: '搜索文档',
//   placeholder: '搜索文档',
// };

const config = {
  lang: 'zh-CN',
  title: '得時笔记',
  description: '记录工作，计算机技术',
  lastUpdated: true,
  // plugins: [SearchPlugin(searchOptions)],
  themeConfig,
  head: [['link', { rel: 'stylesheet', href: '/global.css' }]],
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

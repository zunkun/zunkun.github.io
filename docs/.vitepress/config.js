// import { SearchPlugin } from 'vitepress-plugin-search';

import './init';
import themeConfig from './config/themeConfig';

// default options
// var searchOptions = {
//   previewLength: 62,
//   buttonLabel: '搜索文档',
//   placeholder: '搜索文档',
// };

const config = {
  lang: 'zh_CN',
  title: '得時笔记',
  description: '记录工作，计算机技术',
  // plugins: [SearchPlugin(searchOptions)],
  themeConfig,
};

export default config;

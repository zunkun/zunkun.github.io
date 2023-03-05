import nav from './nav';
import algolia from './algolia';
import sidebarService from '../services/sidebar';

/**
 * 官方主题配置
 */
const themeConfig = {
  siteTitle: '得時笔记',
  // aside: false,
  // logo: '/img/logo.png',
  outline: 'deep',
  outlineTitle: '文档章节',
  docFooter: {
    prev: '上一篇',
    next: '下一篇',
  },
  sidebarMenuLabel: '菜单',
  returnToTopLabel: '回到顶部',
  darkModeSwitchLabel: '深色模式',
  nav,
  sidebar: sidebarService.getSidebar(),
  lastUpdatedText: '更新时间',
  // icp备案
  icp: '豫ICP备20003453号-1',
  // 搜索配置
  algolia,
};

export default themeConfig;

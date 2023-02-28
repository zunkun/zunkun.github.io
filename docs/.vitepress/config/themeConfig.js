import nav from './nav';
import sidebar from './sidebar';
import algolia from './algolia';

/**
 * 官方主题配置
 */
const themeConfig = {
  siteTitle: '得時笔记',
  nav,
  sidebar,
  lastUpdatedText: '更新时间',
  // icp备案
  icp: '豫ICP备20003453号-1',
  // 搜索配置
  algolia,
};

export default themeConfig;

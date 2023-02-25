import { getItemsByNum } from './utils';

/**
 * sidebar config
 */
const sidebar = {
  // 分类整理
  '/categories/JavaScript': getItemsByNum('/categories/JavaScript'),
  '/categories/CSS': getItemsByNum('/categories/CSS'),
  '/categories/Tools': getItemsByNum('/categories/Tools'),
};

export default sidebar;

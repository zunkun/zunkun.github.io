import categoryService from '../services/category';
import topicService from '../services/topic';

// getTopics();

/**
 * sidebar config
 */
function getSidebar() {
  const sidebar = {};
  // 分类
  const categorySidebarMap = categoryService.getSidebarMap();
  Object.assign(sidebar, categorySidebarMap);
  // 专题
  const topicSidebarMap = topicService.getSidebarMap();
  Object.assign(sidebar, topicSidebarMap);

  return sidebar;
}

const sidebar = getSidebar();

export default sidebar;

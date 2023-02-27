import { getItemsByNum, getTopics } from './utils';

getTopics();

/**
 * sidebar config
 */
function getSidebar() {
  const sidebar = {
    // 分类整理
    '/categories/JavaScript': getItemsByNum('/categories/JavaScript'),
    '/categories/CSS': getItemsByNum('/categories/CSS'),
    '/categories/Tools': getItemsByNum('/categories/Tools'),
    '/ideas': getItemsByNum('/ideas'),

    // // 专题
    // '/topics/基础算法': getItemsByNum('/topics/基础算法'),
    // '/topics/设计模式': getItemsByNum('/topics/设计模式'),
    // '/topics/通信安全': getItemsByNum('/topics/通信安全'),
    // '/topics/跨域': getItemsByNum('/topics/跨域'),
    // '/topics/React': getItemsByNum('/topics/React'),
    // '/topics/Vue': getItemsByNum('/topics/Vue'),
  };

  const topics = getTopics() || [];

  topics.forEach(topic => {
    sidebar[topic.path] = getItemsByNum(topic.path);
  });

  return sidebar;
}

const sidebar = getSidebar();

export default sidebar;

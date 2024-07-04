import { existsSync, readFileSync, writeFileSync } from 'fs';

import categoryService from './category';
import ideaService from './idea';
import topicService from './topic';
import qtslService from './qtsl';

const sidebarFilePath = 'docs/data/sidebar.json';

const sidebarService = {
  start() {
    const sidebar = {};
    // 分类
    const categorySidebarMap = categoryService.getSidebarMap();

    // 专题
    const topicSidebarMap = topicService.getSidebarMap();
    // 想法
    const ideaSidebarMap = ideaService.getSidebarMap();
    const qtslSidebarMap = qtslService.getSidebarMap();

    Object.assign(sidebar, categorySidebarMap);
    Object.assign(sidebar, topicSidebarMap);
    Object.assign(sidebar, ideaSidebarMap);
    Object.assign(sidebar, qtslSidebarMap);

    writeFileSync(sidebarFilePath, JSON.stringify(sidebar, null, '\t'));
    return Promise.resolve();
  },

  getSidebar() {
    const fileExist = existsSync(sidebarFilePath);
    if (!fileExist) {
      this.start();
    }

    const fileData = readFileSync(sidebarFilePath, 'utf-8');
    const sidebar = JSON.parse(fileData || '[]');
    return sidebar;
  },
};

export default sidebarService;

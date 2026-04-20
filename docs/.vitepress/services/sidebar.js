import { existsSync, readFileSync, writeFileSync } from 'fs';

import ideaService from './idea';
import qtslService from './qtsl';

const sidebarFilePath = 'docs/data/sidebar.json';

const sidebarService = {
  start() {
    const sidebar = {};

    // 想法
    const ideaSidebarMap = ideaService.getSidebarMap();
    const qtslSidebarMap = qtslService.getSidebarMap();

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

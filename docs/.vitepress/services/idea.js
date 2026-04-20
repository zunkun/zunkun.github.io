import { existsSync, readFileSync, writeFileSync } from 'fs';
import { sync } from 'fast-glob';
import { folderIgnoreNames, getPageLink, getSidebarLists } from './utils';

const ideaFilePath = 'docs/data/ideas.json';

const ideaService = {
  start() {
    console.log('生成想法目录配置文件');
    const entries = sync('docs/ideas/**', {
      deep: 2,
      // onlyDirectories: true,
      objectMode: true,
      markDirectories: true,
      ignore: folderIgnoreNames,
    });

    const ideas = [];

    entries.forEach(entry => {
      ideas.push({
        name: entry.name,
        link: getPageLink(entry.path),
      });
    });

    writeFileSync(ideaFilePath, JSON.stringify(ideas, null, '\t'));
    return Promise.resolve();
  },

  // 获取专题列表
  getIdeas() {
    const fileExist = existsSync(ideaFilePath);
    if (!fileExist) {
      this.start();
    }

    const fileData = readFileSync(ideaFilePath, 'utf-8');

    const ideas = JSON.parse(fileData || '[]');

    return ideas;
  },

  // 获取专题sidebar
  getSidebarMap() {
    const prePath = '/ideas/';

    const ideas = this.getIdeas();

    const ideaList = [];

    ideas.forEach(idea => {
      if (idea.link === '/ideas/') return;

      const sidebarList = getSidebarLists(idea.link);

      const item = {
        text: idea.name,
        link: idea.link,
        items: sidebarList,
      };
      ideaList.push(item);
    });

    const sidebarMap = {
      [prePath]: [
        {
          text: '生活感悟',
          link: prePath,
          items: ideaList,
        },
      ],
    };

    return sidebarMap;
  },
};

export default ideaService;

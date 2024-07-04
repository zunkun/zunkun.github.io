import { existsSync, readFileSync, writeFileSync } from 'fs';
import { sync } from 'fast-glob';
import { folderIgnoreNames, getPageLink, getSidebarLists } from './utils';

const topicFilePath = 'docs/data/topics.json';

const topicService = {
  start() {
    console.log('生成专题目录配置文件');
    const entries = sync('docs/topics/**', {
      deep: 1,
      onlyDirectories: true,
      objectMode: true,
      markDirectories: true,
      ignore: folderIgnoreNames,
    });

    const topics = [];

    entries.forEach(entry => {
      topics.push({
        name: entry.name,
        link: getPageLink(entry.path),
      });
    });

    writeFileSync(topicFilePath, JSON.stringify(topics, null, '\t'));
    return Promise.resolve();
  },

  // 获取专题列表
  getTopics() {
    const fileExist = existsSync(topicFilePath);
    if (!fileExist) {
      this.start();
    }

    const fileData = readFileSync(topicFilePath, 'utf-8');

    const topics = JSON.parse(fileData || '[]');

    return topics;
  },

  // 获取专题sidebar
  getSidebarMap() {
    const topicSidebarMap = {};
    const topics = this.getTopics();

    topics.forEach(topic => {
      topicSidebarMap[topic.link] = getSidebarLists(topic.link);
    });

    console.log({ topicSidebarMap });

    return topicSidebarMap;
  },
};

export default topicService;

import { writeFileSync } from 'fs';
import { sync } from 'fast-glob';
import { folderIgnoreNames, getDateInfo, getDateStr, getFileTitle, getPageLink } from './utils';

const matter = require('gray-matter');

const postFilePath = 'docs/data/posts.json';

const postService = {
  /**
   * 检查目录下文档是否信息完整
   */
  start() {
    console.log('-----------------------------------');
    console.log('检查目录下文档是否信息完整');
    let items = [];

    const entries = sync('docs/**/*.md', {
      onlyFiles: true,
      objectMode: true,
      stats: true,
      markDirectories: true,
      ignore: folderIgnoreNames,
    });

    entries.forEach(entry => {
      console.log(`检查文章 ${entry.path}`);

      const mtObj = matter.read(entry.path);
      if (!mtObj) return;

      if (!mtObj.data.title) {
        mtObj.data.title = getFileTitle(entry);
      }

      if (!mtObj.data.date) {
        mtObj.data.date = getDateStr(entry.stats.ctime);
      }

      if (!mtObj.data.udate) {
        mtObj.data.udate = getDateStr(entry.stats.mtime);
      }

      const item = {
        ...mtObj.data,
        ...getDateInfo(mtObj.data.date),
        fileName: entry.name,
        filePath: entry.path,
        link: getPageLink(entry.path),
      };

      if (mtObj.data.layout !== 'home' && item.title !== 'public') {
        items.push(item);
      }

      writeFileSync(entry.path, matter.stringify(mtObj));
    });

    items = items.sort((a, b) => new Date(b.date) - new Date(a.date));

    writeFileSync(postFilePath, JSON.stringify(items, null, '\t'));
  },
};

export default postService;

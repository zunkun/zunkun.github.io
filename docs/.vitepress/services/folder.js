import { existsSync, writeFileSync } from 'fs';
import { sync } from 'fast-glob';
import { folderIgnoreNames, getDateStr } from './utils';

const matter = require('gray-matter');

const folderService = {
  /**
   * 检查目录文件夹，生成默认文档
   */
  start() {
    console.log('-----------------------------------');
    console.log('检查目录文件夹，生成默认文档');

    const entries = sync('docs/**', {
      onlyDirectories: true,
      objectMode: true,
      stats: true,
      markDirectories: true,
      ignore: folderIgnoreNames,
    });

    entries.forEach(entry => {
      this.checkFolderDesc(entry);
    });
  },

  /**
   * 检查文件夹病生成默认说明文档
   * @param {string} param0 filepath
   * @param {string} param1 title
   */
  checkFolderDesc(entry) {
    console.log(`检查文件夹：${entry.path}`);
    const filepath = `${entry.path}index.md`;
    const title = entry.name;

    const fileExists = existsSync(filepath);
    // 说明文档不存在
    if (!fileExists) {
      const dateStr = getDateStr();

      const mtobj = {
        content: `这是整理的${title}文档`,
        data: {
          title,
          date: dateStr,
          udate: dateStr,
        },
      };
      writeFileSync(filepath, matter.stringify(mtobj));
    }
  },
};

export default folderService;

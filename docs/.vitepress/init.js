import fs from 'fs';
import { sync } from 'fast-glob';

import {
  getAndSetTopics,
  getDateInfo,
  getFilePath,
  getFileTitle,
  parseNameAndLink,
} from './config/utils';

const matter = require('gray-matter');

const ignoreNames = ['.vitepress', '*.json', '*.index.md'];

function getDefaultFileContent(title = '文章标题') {
  const content = `---\ntitle: ${title}\n---\n# ${title}\n这是${title}的文档整理`;

  return content;
}

function initFolers(itemPath, options = {}) {
  console.log('检查默认目录文件');

  const entries = sync('docs/**', {
    onlyDirectories: true,
    objectMode: true,
    stats: true,
    markDirectories: true,
    ignore: ignoreNames,
    ...options,
  });

  entries.forEach(entry => {
    // 过滤 index.md 和 草稿目录
    if (ignoreNames.includes(entry.name)) return;

    const { name: folderName } = parseNameAndLink(entry.path);

    const indexFile = `${entry.path}index.md`;

    const indexExists = fs.existsSync(indexFile);

    if (!indexExists) {
      console.log(`${folderName} 不存在,生成文档`);
      const content = getDefaultFileContent(folderName);
      fs.writeFileSync(indexFile, content);
    }
  });
}

/**
 * 整理文档和目录
 */
export function initDocs() {
  console.log('-------------------------------');
  console.log('开始整理文档目录');

  initFolers('docs');
  console.log('结束整理文档目录');
}

/**
 * 整理文档和目录
 */
export function genPageLists() {
  console.log('获取文章列表');
  const items = [];

  const entries = sync('docs/**/*.md', {
    onlyFiles: true,
    objectMode: true,
    stats: true,
    markDirectories: true,
    ignore: ['*.json', '草稿', 'pages'],
  });

  entries.forEach(entry => {
    const mtObj = matter.read(entry.path);

    if (!mtObj) return;

    if (mtObj.data && !mtObj.data.title) {
      mtObj.data.title = getFileTitle(entry);
    }

    if (mtObj.data && !mtObj.data.date) {
      mtObj.data.date = getDateInfo(entry.stats.ctime || new Date()).ymd;
    }

    if (mtObj.data && !mtObj.data.udate) {
      mtObj.data.udate = getDateInfo(entry.stats.mtime || new Date()).ymd;
    }

    const item = {
      ...mtObj.data,
      ...getDateInfo(mtObj.data.date),
      fileName: entry.name,
      filePath: entry.path,
      path: getFilePath(entry.path),
    };

    if (mtObj.data.layout !== 'home' && item.title !== 'public') {
      items.push(item);
    }

    fs.writeFileSync(entry.path, matter.stringify(mtObj));
  });

  fs.writeFileSync('docs/pages/data.json', JSON.stringify(items, null, '\t'));
}

export default function init() {
  initDocs();
  getAndSetTopics();

  genPageLists();
}

init();

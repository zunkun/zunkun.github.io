import { sync } from 'fast-glob';
import path from 'path';
import { readFileSync, writeFileSync, existsSync } from 'fs';

const ignoreNames = ['*index.md', '*.json', 'pages', '草稿', 'home', 'public'];
const topicPath = 'docs/topics/topic.json';

export function getDateInfo(date = new Date()) {
  // eslint-disable-next-line no-param-reassign
  date = new Date(date);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const monthStr = month < 10 ? `0${month}` : month;
  const dayStr = day < 10 ? `0${day}` : day;

  return {
    year,
    month: monthStr,
    ym: `${year}-${monthStr}`,
    ymd: `${year}-${monthStr}-${dayStr}`,
  };
}

/**
 * 获取文章标题
 * @param {object} param file entry
 * @returns
 */
export function getFileTitle({ name, path: filePath }) {
  if (name !== 'index.md') return name.split('.')[0];

  const arr = filePath.split('/');

  // eslint-disable-next-line no-plusplus
  for (let i = arr.length - 1; i--; i >= 0) {
    if (arr[i] !== 'index.md') {
      return arr[i].split('.')[0];
    }
  }

  return name;
}

/** 获取目录路径 */
export function getDirPath(itemPath) {
  if (!itemPath) return itemPath;
  let targetPath = itemPath;
  if (targetPath.startsWith('/')) targetPath = targetPath.slice(1);
  if (targetPath.endsWith('/')) targetPath = targetPath.slice(0, targetPath.length - 1);
  if (!targetPath.endsWith('/*')) targetPath = `${targetPath}/*`;
  if (!targetPath.startsWith('docs/')) targetPath = `docs/${targetPath}`;

  return targetPath;
}

/**
 * 返回名称和路径
 * @param {string} entryPath
 * @param {Boolean} isDirectory
 * @returns {string} name string
 * @returns {string} path string
 * @returns
 */
export function parseNameAndLink(entryPath, isDirectory) {
  if (!entryPath) {
    return {
      name: '',
      linkPath: '',
    };
  }

  const pathData = path.parse(entryPath);
  let { dir, name } = pathData;
  let linkPath = dir.startsWith('docs/') ? dir.slice(5) : dir;
  linkPath = isDirectory ? `${linkPath}/${name}/` : `${linkPath}/${name}`;

  if (name === 'index') {
    name = '解释说明';
  }

  return {
    name,
    linkPath,
  };
}

export function getFilePath(sourceFilePath = '') {
  let targetFilePath = sourceFilePath;
  if (targetFilePath.startsWith('docs/')) {
    targetFilePath = targetFilePath.slice(4);
  }
  if (targetFilePath.endsWith('index.md')) {
    targetFilePath = targetFilePath.slice(0, targetFilePath.length - 8);
  }

  if (targetFilePath.endsWith('.md')) {
    targetFilePath = targetFilePath.slice(0, targetFilePath.length - 3);
  }
  return targetFilePath;
}

/**
 * @param {string} itemPath item path
 * 根据数字顺序获取sidebar列表
 */
export function getItemsByNum(itemPath, options = {}) {
  if (!itemPath) return [];
  const targetPath = getDirPath(itemPath);

  const items = [];

  const entries = sync(targetPath, {
    onlyFiles: false,
    objectMode: true,
    stats: true,
    markDirectories: true,
    ignore: ignoreNames,
    ...options,
  });

  entries.forEach(entry => {
    // 过滤 index.md 和 草稿目录
    if (ignoreNames.includes(entry.name)) return;
    const isDirectory = entry.dirent.isDirectory();
    const { name, linkPath } = parseNameAndLink(entry.path, isDirectory);

    const item = {
      text: name,
      link: linkPath,
    };
    if (isDirectory) {
      const subItems = getItemsByNum(entry.path);
      if (subItems.length) {
        item.items = subItems;
      }
    }

    items.push(item);
  });
  return items;
}

/**
 * 生成专题目录
 */
export function getAndSetTopics(options = {}) {
  console.log('生成专题目录配置文件');

  const entries = sync('docs/topics/**', {
    onlyDirectories: true,
    objectMode: true,
    deep: 1,
    ignore: ignoreNames,
    ...options,
  });

  const topics = [];

  entries.forEach(entry => {
    topics.push({
      name: entry.name,
      path: `/topics/${entry.name}/`,
      // path: entry.path.slice(4),
    });
  });

  writeFileSync(topicPath, JSON.stringify(topics, null, '\t'));

  return topics;
}

export function getTopics() {
  const fileExist = existsSync(topicPath);
  if (!fileExist) {
    const topics = getAndSetTopics();
    return topics;
  }

  const fileData = readFileSync(topicPath, 'utf-8');

  const topics = JSON.parse(fileData || '[]');

  return topics;
}

import { sync } from 'fast-glob';

export const folderIgnoreNames = [
  '.vitepress',
  '**/public/**',
  '**/data/**',
  'home',
  '**/pages/**',
  '**/草稿/**',
];

export const fileIgnoreNames = ['*index.md', '*.json'];

export const topicPath = 'docs/topics/**';

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
 * 获取年月日
 * @param {date} date DATE
 * @returns
 */
export function getDateStr(date) {
  // eslint-disable-next-line no-param-reassign
  date = new Date(date);
  const year = date.getFullYear();
  return year;
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

/**
 * 获取link
 * @param {string} sourceFilePath
 * @returns
 */
export function getPageLink(filepath = '') {
  if (filepath.startsWith('docs/')) {
    filepath = filepath.slice(4);
  }
  if (filepath.endsWith('index.md')) {
    filepath = filepath.slice(0, filepath.length - 8);
  }

  if (filepath.endsWith('.md')) {
    filepath = filepath.slice(0, filepath.length - 3);
  }
  return filepath;
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
 * @param {string} itemPath item path
 * 根据数字顺序获取sidebar列表
 */
export function getSidebarLists(itemPath) {
  if (!itemPath) return [];
  const targetPath = getDirPath(itemPath);

  const items = [];

  const entries = sync(targetPath, {
    onlyFiles: false,
    objectMode: true,
    stats: true,
    markDirectories: true,
    ignore: [...fileIgnoreNames, ...folderIgnoreNames],
  });

  entries.forEach(entry => {
    // 过滤 index.md 和 草稿目录
    const isDirectory = entry.dirent.isDirectory();

    const name = getFileTitle(entry);
    const link = getPageLink(entry.path);

    const item = {
      text: name,
      link,
    };
    if (isDirectory) {
      const subItems = getSidebarLists(entry.path);
      if (subItems.length) {
        item.items = subItems;
      }
    }

    items.push(item);
  });
  return items;
}

export default {};

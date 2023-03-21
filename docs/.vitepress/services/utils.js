import { sync } from 'fast-glob';

export const folderIgnoreNames = [
  '.vitepress',
  '**/public/**',
  '**/data/**',
  'home',
  '**/posts/**',
  '**/草稿/**',
];

export const fileIgnoreNames = ['**/*index.md', '**/*.json', '**/*.html', '**/*.js'];

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
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const monthStr = month < 10 ? `0${month}` : month;
  const dayStr = day < 10 ? `0${day}` : day;

  return `${year}-${monthStr}-${dayStr}`;
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
export function getSidebarLists(itemPath, parentLink) {
  if (!itemPath) return [];
  const targetPath = getDirPath(itemPath);

  const items = [];

  const entries = sync(targetPath, {
    onlyFiles: false,
    objectMode: true,
    stats: true,
    deep: 2,
    markDirectories: true,
    ignore: [...fileIgnoreNames, ...folderIgnoreNames],
  });

  let indexItem;

  entries.forEach(entry => {
    if (entry.name === 'canvas.html') {
      console.log({ entry, ignore: [...fileIgnoreNames, ...folderIgnoreNames] });
    }
    // 过滤 index.md 和 草稿目录
    const isDirectory = entry.dirent.isDirectory();

    const title = getFileTitle(entry);
    const link = getPageLink(entry.path);

    if (parentLink === link) return;

    const item = {
      text: title,
      link,
    };

    if (isDirectory) {
      const subItems = getSidebarLists(entry.path, link);
      if (subItems.length) {
        item.collapsed = true;
        item.items = subItems;
      }
    }

    if (entry.name === 'index.md') {
      indexItem = item;
    } else {
      items.push(item);
    }
  });

  if (indexItem) items.unshift(indexItem);
  return items;
}

export default {};

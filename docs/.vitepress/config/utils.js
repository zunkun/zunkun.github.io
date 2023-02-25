import { sync } from 'fast-glob';
import path from 'path';

const ignoreNames = ['index.md', '草稿'];

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
  const { dir, name } = pathData;
  let linkPath = dir.startsWith('docs/') ? dir.slice(5) : dir;
  linkPath = isDirectory ? `${linkPath}/${name}/` : `${linkPath}/${name}`;

  return {
    name,
    linkPath,
  };
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
    ignore: ['*index.md', '草稿'],
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

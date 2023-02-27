import { sync } from 'fast-glob';
import path from 'path';
import { readFileSync, writeFileSync, existsSync } from 'fs';

const ignoreNames = ['index.md', '草稿'];
const topicPath = 'docs/topics/topic.json';

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

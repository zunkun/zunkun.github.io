import fs from 'fs';
import { sync } from 'fast-glob';
import { getAndSetTopics, parseNameAndLink } from './config/utils';

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

export default function init() {
  initDocs();
  getAndSetTopics();
}

init();

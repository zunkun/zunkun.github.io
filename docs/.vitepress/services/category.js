import { existsSync, readFileSync, writeFileSync } from 'fs';
import { sync } from 'fast-glob';
import { folderIgnoreNames, getPageLink, getSidebarLists } from './utils';

const categoryFilePath = 'docs/data/categories.json';

const categoryService = {
  check() {
    console.log('生成分类目录配置文件');
    const entries = sync('docs/categories/**', {
      deep: 2,
      onlyDirectories: true,
      objectMode: true,
      markDirectories: true,
      ignore: folderIgnoreNames,
    });

    const categories = [];

    entries.forEach(entry => {
      categories.push({
        name: entry.name,
        link: getPageLink(entry.path),
      });
    });

    writeFileSync(categoryFilePath, JSON.stringify(categories, null, '\t'));
  },

  // 获取分类列表
  getCategories() {
    const fileExist = existsSync(categoryFilePath);
    if (!fileExist) {
      this.check();
    }

    const fileData = readFileSync(categoryFilePath, 'utf-8');

    const categories = JSON.parse(fileData || '[]');

    return categories;
  },

  // 获取分类sidebar
  getSidebarMap() {
    const categorySidebarMap = {};
    const categories = this.getCategories();

    categories.forEach(category => {
      categorySidebarMap[category.link] = getSidebarLists(category.link);
    });

    return categorySidebarMap;
  },
};

export default categoryService;

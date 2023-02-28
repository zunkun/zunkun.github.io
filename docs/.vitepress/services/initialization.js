import categoryService from './category';
import folderService from './folder';
import pageService from './page';
import topicService from './topic';

/**
 * 数据初始化工作
 */
export default function startInitialize() {
  // 检查目录文件夹，生成默认文档
  folderService.check();
  // 检查文件文档
  pageService.check();
  // 检查专题文档列表
  topicService.check();
  // 分类
  categoryService.check();
}

// 启动数据初始化工作
startInitialize();

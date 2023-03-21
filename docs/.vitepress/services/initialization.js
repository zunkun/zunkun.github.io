import categoryService from './category';
import folderService from './folder';
import ideaService from './idea';
import postService from './post';
import sidebarService from './sidebar';
import topicService from './topic';

/**
 * 数据初始化工作
 */

const initService = {
  // 启动数据初始化工作
  start() {
    // 检查目录文件夹，生成默认文档
    folderService.start();
    // 检查文件文档
    postService.start();
    // 检查专题文档列表
    topicService.start();
    // 分类整理
    categoryService.start();
    // sidebar整理
    sidebarService.start();
    // idea整理
    ideaService.start();
  },
};

initService.start();

export default initService;

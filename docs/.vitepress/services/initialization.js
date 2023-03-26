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
    const services = [
      // 检查目录文件夹，生成默认文档
      folderService,
      // 检查文件文档
      postService,
      // 检查专题文档列表
      topicService,
      // 分类整理
      categoryService,
      // sidebar整理
      sidebarService,
      // idea整理
      ideaService,
    ];
    services.forEach(async service => {
      await service.start();
    });
  },
};

initService.start();

export default initService;

/**
 * 导航配置
 */
const nav = [
  {
    text: '分类',
    items: [
      {
        text: 'JavaScript笔记',
        link: '/categories/JavaScript/',
        activeMatch: '/categories/JavaScript/',
      },
      {
        text: 'CSS整理',
        link: '/categories/CSS/',
        activeMatch: '/categories/CSS/',
      },
      {
        text: '工具整理',
        link: '/categories/Tools/',
        activeMatch: '/categories/Tools/',
      },
    ],
  },
  {
    text: '专题',
    items: [
      { text: '专题列表', link: '/topics/' },
      { text: '通信安全', link: '/topics/通信安全/' },
      { text: '基础算法', link: '/topics/基础算法/' },
      { text: 'React', link: '/topics/React/' },
    ],
  },
  {
    text: '标签',
    link: '/tags',
    activeMatch: '/tags',
  },
];

export default nav;
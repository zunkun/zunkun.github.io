import { mkdirSync, writeFileSync, readdirSync, existsSync } from 'fs';
import { getDateStr } from './utils';
import qtslchapters from './qtslchapters';

const qtslDir = 'docs/data/qtsl';
const qtslTargetDir = 'docs/qtsl/traditional';

const qtslService = {
  start() {
    const fileNames = readdirSync(qtslDir);
    fileNames.forEach(fileName => {
      if (fileName.indexOf('卷') === 0) {
        const chapter = fileName;
        const chapternum = parseInt(qtslchapters.indexOf(chapter), 10) + 1;
        // chapter dir path
        const chapterDir = `${qtslTargetDir}/chapter${chapternum}`;
        this.createChpterDir(chapterDir);
        // crate poem page
        this.poemFileCreate(chapterDir, chapter, chapternum);
        this.lineFileCreate(chapterDir, chapter, chapternum);
        this.authorFileCreate(chapterDir, chapter, chapternum);
      }
    });
  },
  createChpterDir(chapterDir) {
    try {
      console.log(`创建目录：${chapterDir}`);
      mkdirSync(chapterDir, { recursive: true });
    } catch (error) {
      console.log(`创建目录失败：${error}`);
    }
  },

  poemFileCreate(chapterDir, chapter, chapternum) {
    const filePath = `${chapterDir}/poem.md`;
    const dateStr = getDateStr();
    const title = `御定全唐詩錄${chapter}诗歌列表`;

    const content = `---
title: ${title}
date: '${dateStr}'
udate: '${dateStr}'
aside: false
---
# ${title}

<PoemList :list="poems" :authorMap="authorMap" :chapternum="${chapternum}" />

<script setup>
const chapter = '${chapter}';
import poems from '/data/qtsl/${chapter}/poems.json'
import authorMap from '/data/qtsl/${chapter}/author.json'
</script>
`;

    writeFileSync(filePath, content, 'utf-8');

    const notMarkedFilePath = `docs/data/qtsl/${chapter}/poems.notmarked.json`;
    // 处理未标注标点的诗句
    const exist = existsSync(notMarkedFilePath);

    if (!exist) return;

    const title2 = `御定全唐詩錄${chapter}未标注标点诗歌列表`;
    const filePath2 = `${chapterDir}/notmarked.md`;
    const content2 = `---
title: ${title2}
date: '${dateStr}'
udate: '${dateStr}'
aside: false
---
# ${title2}

<PoemList :list="poems" :authorMap="authorMap" :chapternum="${chapternum}" />

<script setup>
const chapter = '${chapter}';
import poems from '/data/qtsl/${chapter}/poems.notmarked.json'
import authorMap from '/data/qtsl/${chapter}/author.json'
</script>
`;

    writeFileSync(filePath2, content2, 'utf-8');
  },

  lineFileCreate(chapterDir, chapter, chapternum) {
    const filePath = `${chapterDir}/line.md`;
    const dateStr = getDateStr();
    const title = `御定全唐詩錄${chapter}按行分析`;

    const content = `---
title: ${title}
date: '${dateStr}'
udate: '${dateStr}'
aside: false
---
# ${title}

<LinePage :list="lines" :chapternum="${chapternum}" />

<script setup>
const chapter = '${chapter}';
import lines from '/data/qtsl/${chapter}/lines.json'
</script>
`;

    writeFileSync(filePath, content, 'utf-8');
  },

  authorFileCreate(chapterDir, chapter, chapternum) {
    const filePath = `${chapterDir}/author.md`;
    const dateStr = getDateStr();
    const title = `御定全唐詩錄${chapter}诗人作者`;

    const content = `---
title: ${title}
date: '${dateStr}'
udate: '${dateStr}'
aside: false
---
# ${title}

<AuthorPage :authorMap="authorMap" :chapternum="${chapternum}" />

<script setup>
const chapter = '${chapter}';
import authorMap from '/data/qtsl/${chapter}/author.json'
</script>
`;

    writeFileSync(filePath, content, 'utf-8');
  },

  getSidebarMap() {
    const prePath = '/qtsl/traditional/';

    let items = [];

    const fileNames = readdirSync(qtslDir);
    fileNames.forEach(fileName => {
      if (fileName.indexOf('卷') === 0) {
        const chapter = fileName;
        const chapternum = parseInt(qtslchapters.indexOf(chapter), 10) + 1;

        const subitems = [
          {
            text: `${chapter}诗歌列表`,
            link: `${prePath}chapter${chapternum}/poem`,
          },
          {
            text: `${chapter}按行分析`,
            link: `${prePath}chapter${chapternum}/line`,
          },
          {
            text: `${chapter}诗人作者`,
            link: `${prePath}chapter${chapternum}/author`,
          },
        ];

        const notMarkedFilePath = `docs/data/qtsl/${chapter}/poems.notmarked.json`;
        // 处理未标注标点的诗句
        const exist = existsSync(notMarkedFilePath);
        if (exist) {
          subitems.push({
            text: '未注标点诗歌',
            link: `${prePath}chapter${chapternum}/notmarked`,
          });
        }

        const chapterItem = {
          chapternum,
          text: chapter,
          collapsed: true,
          items: subitems,
        };

        items.push(chapterItem);
      }
    });

    items = items.sort((a, b) => a.chapternum - b.chapternum);

    const statistics = [
      {
        text: '统计数据',
        collapsed: true,
        items: [
          {
            text: '数据总览',
            link: `${prePath}statistics/`,
          },
          {
            text: '章节详细',
            link: `${prePath}statistics/章节详细统计`,
          },
        ],
      },
    ];

    const sidebarMap = {
      [prePath]: [
        {
          text: '御定全唐詩錄',
          link: prePath,
          items: statistics.concat(items),
        },
      ],
    };

    console.log({ sidebarMap });
    return sidebarMap;
  },
};

export default qtslService;

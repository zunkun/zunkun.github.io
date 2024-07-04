import { existsSync, readFileSync, writeFileSync, readdirSync } from 'fs';

const qtslDir = 'docs/data/qtsl';
const qtslTargetDir = 'docs/qtsl/traditional';
const chapterListPath = 'docs/data/qtsl/chapterList.json';

const qtslService = {
  start() {
    const chapterList = JSON.parse(readFileSync(chapterListPath, 'utf-8') || '[]') || {};
    const fileNames = readdirSync(qtslDir);
    fileNames.forEach(fileName => {
      if (fileName.indexOf('卷') === 0) {
        const chapter = fileName;
        const chapternum = parseInt(chapterList.indexOf(chapter), 10) + 1;

        this.poemFileCreate(chapter, chapternum);
      }
    });
  },
  poemFileCreate(chapter, chapternum) {
    const poemFilePath = `${qtslTargetDir}/poem${chapternum}.md`;

    const content = `---
title: 全唐诗录诗歌列表
date: '2023-02-26'
udate: '2023-02-26'
---
# 御定全唐詩錄${chapter}

<PoemList :list="poems" :authorMap="authorMap" />


<script setup>
const chapter = '${chapter}';
import poems from '/data/qtsl/${chapter}/poems.json'
import authorMap from '/data/qtsl/${chapter}/author.json'
</script>
`;

    writeFileSync(poemFilePath, content, 'utf-8');
  },

  getSidebarMap() {
    const prePath = '/qtsl/traditional/';

    let items = [];

    const chapterList = JSON.parse(readFileSync(chapterListPath, 'utf-8') || '[]') || {};
    const fileNames = readdirSync(qtslDir);
    fileNames.forEach(fileName => {
      if (fileName.indexOf('卷') === 0) {
        const chapter = fileName;
        const chapternum = parseInt(chapterList.indexOf(chapter), 10) + 1;
        items.push({
          chapternum,
          text: chapter,
          link: `${prePath}poem${chapternum}.md`,
          items: [],
        });
      }
    });

    items = items.sort((a, b) => a.chapternum - b.chapternum);

    const sidebarMap = {
      [prePath]: [
        {
          text: '御定全唐詩錄',
          link: prePath,
          items,
        },
      ],
    };

    console.log({ sidebarMap });
    return sidebarMap;
  },
};

export default qtslService;

---
title: 全唐诗录诗歌列表
date: '2023-02-26'
udate: '2023-02-26'
---
# 御定全唐詩錄卷六

<PoemList :list="poems" :authorMap="authorMap" />


<script setup>
const chapter = '卷六';
import poems from '/data/qtsl/卷六/poems.json'
import authorMap from '/data/qtsl/卷六/author.json'
</script>
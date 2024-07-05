---
title: 全唐诗录诗歌列表
date: '2024-07-05'
udate: '2024-07-05'
---
# 御定全唐詩錄卷四

<PoemList :list="poems" :authorMap="authorMap" />


<script setup>
const chapter = '卷四';
import poems from '/data/qtsl/卷四/poems.json'
import authorMap from '/data/qtsl/卷四/author.json'
</script>

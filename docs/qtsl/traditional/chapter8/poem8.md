---
title: 全唐诗录诗歌列表
date: '2024-07-05'
udate: '2024-07-05'
---
# 御定全唐詩錄卷八

<PoemList :list="poems" :authorMap="authorMap" />


<script setup>
const chapter = '卷八';
import poems from '/data/qtsl/卷八/poems.json'
import authorMap from '/data/qtsl/卷八/author.json'
</script>

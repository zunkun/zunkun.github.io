---
title: 全唐诗录诗歌列表
date: '2024-07-05'
udate: '2024-07-05'
---
# 御定全唐詩錄卷十

<PoemList :list="poems" :authorMap="authorMap" />


<script setup>
const chapter = '卷十';
import poems from '/data/qtsl/卷十/poems.json'
import authorMap from '/data/qtsl/卷十/author.json'
</script>

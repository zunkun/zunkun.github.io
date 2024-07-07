---
title: 御定全唐詩錄卷十诗歌列表
date: '2024-07-07'
udate: '2024-07-07'
aside: false
---
# 御定全唐詩錄卷十诗歌列表

<PoemList :list="poems" :authorMap="authorMap" :chapternum="10" />

<script setup>
const chapter = '卷十';
import poems from '/data/qtsl/卷十/poems.json'
import authorMap from '/data/qtsl/卷十/author.json'
</script>

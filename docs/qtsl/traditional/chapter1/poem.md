---
title: 御定全唐詩錄卷一诗歌列表
date: '2024-07-06'
udate: '2024-07-06'
aside: false
---
# 御定全唐詩錄卷一诗歌列表

<PoemList :list="poems" :authorMap="authorMap" :chapternum="1" />

<script setup>
const chapter = '卷一';
import poems from '/data/qtsl/卷一/poems.json'
import authorMap from '/data/qtsl/卷一/author.json'
</script>

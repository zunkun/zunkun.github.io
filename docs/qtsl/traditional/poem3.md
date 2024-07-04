---
title: 全唐诗录诗歌列表
date: '2023-02-26'
udate: '2023-02-26'
---
# 御定全唐詩錄卷三

<PoemList :list="poems" :authorMap="authorMap" />


<script setup>
const chapter = '卷三';
import poems from '/data/qtsl/卷三/poems.json'
import authorMap from '/data/qtsl/卷三/author.json'
</script>
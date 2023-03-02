<template>
  <div class="pages">
   <div class="pageitem" v-for="pageInfo in pageList.list" :key="pageInfo.title">
     <div class="title"><a :href="pageInfo.link">{{ pageInfo.title }}</a></div>
     <div class="subs">
      <div class="subitem">{{ pageInfo.date }}</div>
     </div>
   </div>
   <div class="moreline" v-if="pageList.hasMore">
      <div class="morebox" @click="onLoad">加载更多...</div>
   </div>
  </div>
 </template>

<script setup>
import { reactive } from 'vue';

const props = defineProps({
  list: Array,
});

console.log(3, 4, 5);

const pageList = reactive({
  list: [],
  page: 0,
  size: 10,
  hasMore: true,
});

function onLoad() {
  const total = props?.list?.length || 0;

  if (pageList.list.length < total) {
    pageList.page += 1;
    pageList.list = props?.list?.slice(0, 10 * pageList.page);
  }

  if (pageList.list.length >= total) {
    pageList.hasMore = false;
  }
}

onLoad();

</script>

<style scoped lang="less">
.pages {
  .pageitem {
    // padding: 10px 0px 0px;
    border-top: 1px solid #efefef;
    .title {
      font-size: 20px;
      line-height: 30px;
      text-overflow: ellipsis;
      overflow: hidden;
      word-break: break-all;
      white-space: nowrap;
    }

    .subs  {
      .subitem {
        color: #aaa;
        font-size: 14px;
        line-height: 20px;
      }
    }
  }

  .moreline {
    text-align: center;
    cursor: pointer;

    .morebox {
      display: inline-block;
      width: 200px;
      height: 30px;
      font-size: 20px;
      // border: 1px solid green;

    }
  }
}

 </style>

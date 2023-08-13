<template>
  <div class="posts">
   <div class="postitem" v-for="postInfo in postList.list" :key="postInfo.title">
     <div class="title"><a :href="postInfo.link">{{ postInfo.title }}</a></div>
     <div class="subs">
      <div class="subitem">{{ postInfo.date }}</div>
     </div>
   </div>
   <div class="moreline" v-if="postList.hasMore">
      <div class="morebox" @click="onLoad">加载更多...</div>
   </div>
  </div>
 </template>

<script setup>
import { reactive } from 'vue';

const props = defineProps({
  list: Array,
});

const postList = reactive({
  list: [],
  post: 0,
  size: 10,
  hasMore: true,
});

function onLoad() {
  const total = props?.list?.length || 0;

  if (postList.list.length < total) {
    postList.post += 1;
    postList.list = props?.list?.slice(0, 10 * postList.post);
  }

  if (postList.list.length >= total) {
    postList.hasMore = false;
  }
}

onLoad();

</script>

<style scoped lang="less">
.posts {
  margin-top: 20px;
  .postitem {
    // padding: 10px 0px 0px;
    border-bottom: 1px solid #efefef;

    padding: 4px;
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

  .postitem:first-child {
    border-top: 1px solid #efefef;
  }

  .moreline {
    margin-top: 10px;
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

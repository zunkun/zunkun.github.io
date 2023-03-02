<template>
  <div class="pages">
   <div class="pageitem" v-for="pageInfo in props.list" :key="pageInfo.title">
     <div class="title"><a :href="pageInfo.link">{{ pageInfo.title }}</a></div>
     <div class="subs">
      <div class="subitem">{{ pageInfo.date }}</div>
     </div>
   </div>

  </div>
 </template>

<script setup>
const props = defineProps({
  list: Array,
});

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
}

 </style>

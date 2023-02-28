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
  .page {
    border-top: 1px solid #ccc;
    .title {
      font-size: 20px;
      line-height: 24px;
    }

    .subs  {
      .subitem {
        color: #eee;
      }
    }
  }
}

 </style>

<template>
 <div class="poemlists">
  <div class="poem" v-for="(poem, index) in props.list" :key="poem.id">
    <div class="title">
      <a :href="`#${poem.title}`">[{{ index+1 }}] {{ poem.title  }}</a>
    </div>
    <div class="author">{{ poem.author  }}</div>
    <div class="authordesc">{{ props?.authorMap?.[poem?.author]?.authordesc }}</div>
    <div class="desc">{{ poem.titledesc  }}</div>
    <div class="content">{{ poem.content }}</div>
  </div>

 </div>
</template>

<script setup>
const props = defineProps({
  list: Array,
  authorMap: Object,
});

</script>

<style scoped lang="less">
  .poemlists {
    margin-top: 30px;
  }

  .poem {
    margin-bottom: 30px;
    border-top: 1px solid #ccc;
    padding: 10px 0px;

    .title {
      line-height: 1.4;
      font-size: 24px;
      cursor: pointer;
    }

    .author {
      line-height: 1.4;
      font-size: 16px;
      margin: 4px 0px;
    }

    .authordesc {
      margin: 6px 0px;
      color: #9896f1;
      font-style: italic;
    }

    .content {
      font-size: 16px;
    }
  }

</style>

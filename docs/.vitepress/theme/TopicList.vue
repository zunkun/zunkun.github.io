<template>
 <div class="topics">
  <div class="topic" v-for="topic in props.topics" :key="topic.name">
    <a :href="topic.link">{{ topic.name }}</a>
  </div>

 </div>
</template>

<script setup>
const props = defineProps({
  topics: Array,
});

</script>

<style scoped lang="less">
.topics {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 20px 20px;

  .topic {
    height: 60px;
    cursor: pointer;
    border-radius: 4px;
    border: 1px solid #99CC99;

    text-align: center;
    font-size: 20px;
    line-height: 60px;

    box-shadow:  0px 1px 4px #10b981;

    a {
      display: block;
    }
  }
}

</style>

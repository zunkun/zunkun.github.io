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

}

.topic {
    cursor: pointer;
    border-radius: 4px;
    border: 1px solid #99CC99;

    text-align: center;
    font-size: 20px;
    line-height: 50px;

    box-shadow:  0px 1px 4px #10b981 inset;

    a {
      display: block;
    }
  }

@media only screen
and (min-device-width : 768px){
  .topics {
    grid-template-columns: repeat(4, 1fr);
  }
}
@media only screen
and (max-device-width : 768px) {
  .topics {
    grid-template-columns: repeat(2, 1fr);
  }
}

</style>

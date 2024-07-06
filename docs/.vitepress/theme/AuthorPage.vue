<template>
  <div class="page">
    <div class="authorlist" v-for="(author, key) in props.authorMap" :key="key">
      <div class="author" :id="author.author">
        <a :href="`#${author.author}`" class="authorlink">{{ author.author }}</a>
      </div>
      <div class="authordesc">{{ author.authordesc }}</div>
      <div class="title2">诗文列表</div>
      <div class="charstylelist" v-for="(poems, charstyle) in author.charstyleMap" :key="charstyle">
        <div class="charstyle">{{ charstyle }}</div>

        <div class="poemlist" v-for="(poem, key) in poems" :key="key">
          <a class="poemtitle" :href="`poem.html#${poem.title}`">{{ poem.title }}</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  chapternum: Number,
  authorMap: Object,
});
</script>

<style scoped lang="less">
.page {
  margin-top: 30px;
}

.authorlist {
  // margin-bottom: 20px;
  border-bottom: 1px solid #ccc;
  padding: 10px 0px;
}

.author {
  font-size: 24px;
  line-height: 2;
  font-weight: 600;
  color: #9966cc;
}

.authorlink {
  color: #9966cc;
}

.authordesc {
  color: #cc99cc;
  line-height: 2;
  font-style: italic;
  white-space: pre-wrap;
}

.title2 {
  font-size: 20px;
  line-height: 2;
  font-weight: 600;
  color: #009999;
        white-space: pre-wrap;
}

.charstylelist {
  .charstyle {
    font-size: 18px;
    line-height: 2;
  }
}

.poemtitle {
  cursor: pointer;
  padding-left: 2rem;
  line-height: 2;
        white-space: pre-wrap;
}
</style>

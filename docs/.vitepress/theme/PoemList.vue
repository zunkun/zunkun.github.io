<template>
  <div class="poemlists">
    <div v-for="group in groups" :key="group.key">
      <div class="group" :id="`G${group.key}`" v-if="group.type === 'collection'">
        <a :href="`#G${group.key}`" class="collection">{{ group.collection }}</a>
        <div class="collectiondesc" v-if="group.collectiondesc">{{ group.collectiondesc }}</div>

        <div v-for="poem in group.list" :key="poem.key" class="grouppoems">
          <div class="poem" :id="`${poem.uid}`">
            <div class="title">
              <a :href="`#${poem.uid}`"
                >[{{ poem.poemindex }}]
                <span v-if="poem.collection">{{ poem.collection }}</span>
                {{ poem.title }}</a
              >
            </div>
            <div class="author">
              <a :href="`author.html#${poem.author}`" class="authorlink">{{ poem.author }}</a>
            </div>
            <div class="titledesc" v-if="poem.titledesc">{{ poem.titledesc }}</div>
            <div class="content">{{ poem.content }}</div>
          </div>
        </div>
      </div>

      <div class="poem" :id="`${group.uid}`" v-if="group.type === 'poem'">
        <div class="title">
          <a :href="`#${group.uid}`">[{{ group.poemindex }}] {{ group.title }}</a>
        </div>
        <div class="author">
          <a :href="`author.html#${group.author}`" class="authorlink">{{ group.author }}</a>
        </div>
        <div class="titledesc" v-if="group.titledesc">{{ group.titledesc }}</div>
        <div class="content">{{ group.content }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';

const props = defineProps({
  list: Array,
  authorMap: Object,
});

const groups = reactive([]);

let collectionGroup = null;

props?.list?.forEach(poem => {
  if (poem.collection) {
    if (!collectionGroup) {
      collectionGroup = {
        type: 'collection',
        key: poem.collection,
        collection: poem.collection,
        collectiondesc: poem.collectiondesc,
        list: [],
      };

      groups.push(collectionGroup);
    }

    poem.type = 'poem';
    poem.key = poem.uid;
    poem.collectionnum = collectionGroup.list.length + 1;
    collectionGroup.list.push(poem);
  } else {
    if (collectionGroup) {
      collectionGroup = null;
    }

    poem.type = 'poem';
    poem.key = poem.uid;
    groups.push(poem);
  }
});
</script>

<style scoped lang="less">
.poemlists {
  margin-top: 30px;
}

.group,
.poem {
  margin-bottom: 30px;
  border-top: 1px solid #ccc;
  padding: 10px 0px;
}

.grouppoems {
  padding-left: 2rem;
}

.collection {
  line-height: 1.4;
  font-size: 24px;
  cursor: pointer;
  line-height: 2;
  // color: red;
}

.collectiondesc {
  font-style: italic;
  font-size: 14px;
  line-height: 2;
}

.title {
  line-height: 1.4;
  font-size: 20px;
  cursor: pointer;
  line-height: 2;
}

.titledesc {
  font-style: italic;
  font-size: 14px;
  line-height: 2;
  margin-bottom: 10px;
  color: #3366cc;
}

.author {
  color: #9966cc;
  line-height: 2;
}

.authorlink {
  line-height: 1.4;
  font-size: 16px;
  margin: 4px 0px;
  color: #9966cc;
}

.authordesc {
  margin: 6px 0px;
  color: #9896f1;
  font-style: italic;
  white-space: pre-wrap;
}

.content {
  font-size: 16px;
  line-height: 2;
  white-space: pre-wrap;
}
</style>

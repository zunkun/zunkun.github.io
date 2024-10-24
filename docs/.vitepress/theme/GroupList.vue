<template>
 <div class="items">
  <div class="itembox" v-for="item in props.list" :key="item.name">
    <a :href="item.link">{{ item.name }}</a>
  </div>

 </div>
</template>

<script setup>
const props = defineProps({
  list: Array,
});

</script>

<style scoped lang="less">
.items {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 20px 20px;

}

.itembox {
    cursor: pointer;
    border-radius: 4px;
    border: 1px solid var(--vp-c-brand-1);

    text-align: center;
    font-size: 20px;
    line-height: 50px;

    // box-shadow:  0px 1px 4px var(--vp-c-brand-1);

    a {
      display: block;
    }
  }

@media only screen
and (min-device-width : 768px){
  .items {
    grid-template-columns: repeat(4, 1fr);
  }
}
@media only screen
and (max-device-width : 768px) {
  .items {
    grid-template-columns: repeat(2, 1fr);
  }
}

</style>

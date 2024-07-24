<template>
  <div class="linepage">
    <table>
      <thead>
        <tr>
          <th>行号</th>
          <th>类型</th>
          <th>内容</th>
        </tr>
      </thead>
      <tbody>
        <tr class="line" v-for="(line, index) in props.list" :key="line.id">
          <td class="linenum">
            <a :id="`line-${index + 1}`" :href="`#line-${index + 1}`">{{ index + 1 }}</a>
          </td>
          <td :class="`type linetype-${line.linetype}`">{{ line.type }}</td>
          <td class="content">{{ line.content }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
const props = defineProps({
  list: Array,
});
</script>

<style scoped lang="less">
.linepage {
  margin-top: 40px;
}

.line {
  .linenum {
    width: 80px;
  }

  .type {
    width: 100px;
  }

  .linetype-bookdesc {
    color: #0aa344;
  }

  .linetype-author {
    color: #9966cc;
  }

  .linetype-authordesc {
    color: #cc99cc;
  }

  .linetype-charstyle {
    color: #ff7500;
  }

  .linetype-title {
    color: #10b981;
  }

  .linetype-titledesc {
    color: #339933;
  }

  .linetype-content {
    color: #3366cc;
  }

  .linetype-contentgroup {
    color: red;
  }

  .content {
    flex: 1;
    white-space: pre-wrap;
  }
}
</style>

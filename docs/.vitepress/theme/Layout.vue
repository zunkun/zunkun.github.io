<template>
  <Layout>
    <template #layout-bottom>
     <div class="footer">
        {{theme.siteTitle}} {{new Date().getFullYear()}} &copy;
        <a href="https://beian.miit.gov.cn" target="_blank">{{theme.icp }}</a>
    </div>
    </template>
  </Layout>
</template>

<script setup>
import { useData } from 'vitepress';
import DefaultTheme from 'vitepress/theme';

const { Layout } = DefaultTheme;
const { theme } = useData();

</script>

<style scoped>
.footer {
  height: 60px;
  line-height: 60px;
  text-align: center;
  border-top: 1px solid #eee;
}
</style>

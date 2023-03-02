// .vitepress/theme/index.js
import DefaultTheme from 'vitepress/theme';
import Layout from './Layout.vue';
import GroupList from './GroupList.vue';
import PageList from './PageList.vue';

export default {
  ...DefaultTheme,
  // override the Layout with a wrapper component that
  // injects the slots
  Layout,
  enhanceApp(ctx) {
    DefaultTheme.enhanceApp(ctx);
    ctx.app.component('GroupList', GroupList);
    ctx.app.component('PageList', PageList);
  },
};

// .vitepress/theme/index.js
import DefaultTheme from 'vitepress/theme';
// import mediumZoom from 'medium-zoom';
import mediumZoom from 'https://cdn.bootcdn.net/ajax/libs/medium-zoom/1.0.8/medium-zoom.esm.min.js';
import { onMounted } from 'vue';
import Layout from './Layout.vue';
import TopicList from './TopicList.vue';
import PageList from './PageList.vue';

export default {
  ...DefaultTheme,
  // override the Layout with a wrapper component that
  // injects the slots
  Layout,
  enhanceApp(ctx) {
    DefaultTheme.enhanceApp(ctx);
    ctx.app.component('TopicList', TopicList);
    ctx.app.component('PageList', PageList);
  },
  setup() {
    onMounted(() => {
      console.log(mediumZoom);
      mediumZoom('[zoom]', {
        scrollOffset: undefined,
        background: '#00000073',
        container: 'body',
      });
    });
  },
};

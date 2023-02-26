// .vitepress/theme/index.js
import DefaultTheme from 'vitepress/theme';
import mediumZoom from 'medium-zoom';
import { onMounted } from 'vue';
import Layout from './Layout.vue';
import TopicList from './TopicList.vue';

import './index.css';

export default {
  ...DefaultTheme,
  // override the Layout with a wrapper component that
  // injects the slots
  Layout,
  enhanceApp(ctx) {
    DefaultTheme.enhanceApp(ctx);
    ctx.app.component('TopicList', TopicList);
  },
  setup() {
    onMounted(() => {
      mediumZoom('[zoom]', {
        scrollOffset: undefined,
        background: '#00000073',
        container: 'body',
      });
    });
  },
};

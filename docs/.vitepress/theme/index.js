// .vitepress/theme/index.js
import DefaultTheme from 'vitepress/theme';
import { onMounted, watch, nextTick } from 'vue';
import { useRoute } from 'vitepress';
import mediumZoom from 'medium-zoom';
import Layout from './Layout.vue';
import GroupList from './GroupList.vue';
import PostList from './PostList.vue';
import PoemList from './PoemList.vue';
import AuthorPage from './AuthorPage.vue';
import LinePage from './LinePage.vue';

export default {
  ...DefaultTheme,
  // override the Layout with a wrapper component that
  // injects the slots
  Layout,
  enhanceApp(ctx) {
    DefaultTheme.enhanceApp(ctx);
    ctx.app.component('GroupList', GroupList);
    ctx.app.component('PostList', PostList);
    ctx.app.component('PoemList', PoemList);
    ctx.app.component('AuthorPage', AuthorPage);
    ctx.app.component('LinePage', LinePage);
  },

  setup() {
    const route = useRoute();
    const initZoom = () => {
      mediumZoom('img', {
        // background: 'var(--vp-c-bg)',
        background: '#efefef',
        container: 'body',
        scrollOffset: '20%',
        zIndex: 200,
        margin: 20,
      });
    };
    onMounted(() => {
      initZoom();
    });
    watch(
      () => route.path,
      () => nextTick(() => initZoom()),
    );
  },
};

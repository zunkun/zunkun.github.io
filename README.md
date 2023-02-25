# 得時笔记
得時笔记，记录工作和生活

[https://liuzunkun.com](https://liuzunkun.com)

## 技术方案
vitepress

## 配置
文档在 `docs/` 目录下，新建文件夹自行生成 `index.md` 文件

### github action 配置

``` yml
name: Deploy
on:
  workflow_dispatch: {}
  push:
    branches:
      - main
jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      pages: write
      id-token: write
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0
      - uses: actions/setup-node@v3
        with:
          node-version: 16
          cache: npm
      - run: npm install
      - name: Build
        run: npm run build
      - uses: actions/configure-pages@v2
      - uses: actions/upload-pages-artifact@v1
        with:
          path: docs/.vitepress/dist
      - name: Deploy
        id: deployment
        uses: actions/deploy-pages@v1


```


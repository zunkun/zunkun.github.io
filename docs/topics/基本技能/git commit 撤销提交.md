---
title: git commit 撤销提交
date: '2023-03-21'
udate: '2023-03-21'
---

# git commit 撤销提交
假如在git提交時做了如下操作,如果想撤回操作，该怎么办呢  ？

```bash
git add .
git commit -m "commit msg"
```
## git reset
```bash
git reset --soft HEAD^
```

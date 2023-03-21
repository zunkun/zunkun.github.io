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

# 或者
git reset --soft HEAD~2
# 2 是最近第二次提交
```
只是撤销了 commit 操作，但是 没有撤销修改，文件任然是 `staged`

### soft
撤销commit操作，不改变 `git add .` 操作

### hard 参数
```bash
git reset --hard HEAD^
```
撤销代码到上一次提交的状态，撤销修改，撤销commit， 撤销 `git add .`

### mixed
不删除修改代码，撤销 `git commit `, 撤销 `git add `

## 修改commit
如果git提交需要验证commit message, 当写错的时候，可以使用 `amend` 修改

```bash
git commit --amend
```
下面是修改時进入的vim环境
![amend](/img/amend.png)

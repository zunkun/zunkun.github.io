---
title: postMessage通信
date: '2023-07-10'
udate: '2023-07-10'
---

# postMessage 通信

## 背景

假设在 `a.liuzunkun.com`(简称 A) 服务中部署了另一个域名的服务 `b.liuzunkun.com`（简称 B）， 如果服务 B 请求了 A 的接口，则存在跨域，怎么处理呢？

## 解决方案

由于 A 不存在跨域，则可以将 B 对服务 A 的逻辑请求放在 A 中。

1. A 中通过 iframe 引用 B
2. B 中通过 `parent.postMessage` 发送信息到 A 窗口
3. A 接收来自 B 的信息，A 请求 A 的服务，请求接口可以发送到 A 中

## 参考

1. [iframe 中 postMessage 通信](https://liuzunkun.com/categories/JavaScript/24-iframe%E4%B8%ADpostMessage%E9%80%9A%E4%BF%A1.htm)

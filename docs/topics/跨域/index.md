---
title: 跨域
---

# 跨域
跨域是指一个域下的文档或脚本试图去请求另一个域下的资源，这里跨域是广义的。

## 同源策略

同源策略是一种约定，由Netscape公司1995年引入浏览器，它是浏览器最核心也最基本的安全功能，如果缺少了同源策略，浏览器很容易受到XSS、CSFR等攻击。所谓同源是指"协议+域名+端口"三者相同，即便两个不同的域名指向同一个ip地址，也非同源。

URL组成：

![https://alliance-communityfile-drcn.dbankcdn.com/FileServer/getFile/cmtybbs/132/978/613/0220086000132978613.20210421101110.21363055064459837253856369170386:50530615083431:2800:85BE90BB1245D23C3140ADAE16D9E623EFD0EFE38AB7E9FD4C5662112022E88F.png](https://alliance-communityfile-drcn.dbankcdn.com/FileServer/getFile/cmtybbs/132/978/613/0220086000132978613.20210421101110.21363055064459837253856369170386:50530615083431:2800:85BE90BB1245D23C3140ADAE16D9E623EFD0EFE38AB7E9FD4C5662112022E88F.png)

同源策略限制以下几种行为：

- Cookie、LocalStorage 和 IndexDB 无法读取
- DOM和JS对象无法获得
- AJAX 请求不能发送
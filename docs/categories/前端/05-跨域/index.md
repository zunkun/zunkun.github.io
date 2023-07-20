---
title: 跨域
date: '2023-02-26'
udate: '2023-02-26'
---

# 跨域

跨域是浏览器限制一个域向另一个域发送 Ajax 请求。跨域存在于浏览器中。跨域的核心是浏览器的同源策略。

## 同源策略

决定一个源的因素有

1. 域名，比如 `a.liuzunkun.com` 和 `b.liuzunkun.com` 跨域
2. 端口，比如 `http://liuzunkun.com:80` 和 `http://liuzunkun.com:8080` 跨域
3. 协议，`https` 和 `http` 跨域，比如 `https://liuzunkun.com` 和 `http://liuzunkun.com` 跨域

同源策略限制以下几种行为：

- Cookie、LocalStorage、SessionStorage 和 IndexDB 无法读取
- DOM 和 JS 对象无法获得
- AJAX 请求不能发送

## 跨域常用解决方案

结论： 跨域要么解决，要么绕过

1. JSONP 方案
2. 接口正向代理， 比如 nodejs 中的 `http-proxy-middleware`
3. nginx 方向代理, `proxy_pass`
4. CORS 方案

## 跨域注意事项

1. 跨域发生在浏览器端，如果通过其他方式请求，比如 postman 则接口能正常使用
2. 跨域被浏览器阻止了，但是服务端可能已经返回了正确的结果
3. 跨域会阻止 JS 发起的 Ajax 请求，但是一些静态资源标签自带跨域功能，比如 `script, link, video, img, audio` 等，除非设置跨域规则。

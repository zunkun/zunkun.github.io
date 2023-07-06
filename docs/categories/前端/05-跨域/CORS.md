---
title: CORS
---

# CORS

推荐阅读阮一峰的 CORS 介绍，这是目前看到的最清晰的介绍。

CORS(Cross-Origin Resource Sharing) 跨域资源共享，是解决跨域的一种方案。其需要前后端配合使用，单独前端无法解决 cors 跨域。

CORS 后端配合关键是 http response header 中的一些参数

- Access-Control-Allow-Origin 接口允许的 origin 列表
- Access-Control-Allow-Methods 接口允许的方法，可以是 `GET,PUT,POST,OPTIONS` 等
- Access-Control-Allow-Headers header 设置， 比如 `X-PINGOTHER, Content-Type`
- Access-Control-Max-Age `OPTIONS` 预检请求缓存当前接口使用， 默认 5s
- Access-Control-Allow-Credentials 前端请求是否携带 `Cookie`信息， 由于 cookie 特性，需要指定 origin

## OPTIONS 预检

跨域有时会有预检 OPTIONS 请求操作，其会在请求前预检服务端是否允许请求操作, 阮一峰教程里面说是非简单 HTTP 请求会有此操作

1. 浏览器发起 options 请求，携带 参数如下

- Origin
- Access-Control-Request-Method， 比如当前请求 POST
- Access-Control-Request-Headers 比如 Content-Type, 表示浏览器额外发送的请求头参数

2. 服务端接收 OPTIONS 请求验证，并返回响应参数, 如果验证成功，可以返回 200， 否则可以返回 403

- Access-Control-Allow-Origin 接口允许的 origin 列表
- Access-Control-Allow-Methods 接口允许的方法，可以是 `GET,PUT,POST,OPTIONS` 等
- Access-Control-Allow-Headers header 设置， 比如 `X-PINGOTHER, Content-Type`
- Access-Control-Max-Age `OPTIONS` 预检请求缓存当前接口使用， 默认 5s
- Access-Control-Allow-Credentials 前端请求是否携带 `Cookie`信息， 由于 cookie 特性，需要指定 origin

3. 浏览器根据 CORS 服务返回信息，决定当前请求以及后后续请求是否允许跨域

OPTIONS 请求 缺点参考 [跨域（Options）请求介绍及解决方法 #](https://hughfenghen.github.io/fe-basic-course/options-request.html#%E4%BB%8B%E7%BB%8D)

## nodejs 中解决方案

在 nodejs 中解决 cors 问题比较简单，使用插件解决即可，比如 `@koa/cors` 插件解决 `koa` 中跨域问题

```js
const Koa = require('koa');
const cors = require('@koa/cors');

const app = new Koa();
app.use(cors(options));
```

或者

```js
app.use(function (req, res, next) {
  if (req.method == 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'content-type');
    res.status(200).end();
  }
});
```

## 参考

1. [跨域资源共享 CORS 详解 | 阮一峰](https://www.ruanyifeng.com/blog/2016/04/cors.html)

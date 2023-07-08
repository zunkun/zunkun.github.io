---
title: CORS
date: '2023-07-06'
udate: '2023-07-06'
---

# CORS

推荐阅读阮一峰的 CORS 介绍，这是目前看到的最清晰的介绍。

CORS(Cross-Origin Resource Sharing) 跨域资源共享，是解决跨域的一种方案。

跨域存在于浏览器环境中，由于同源策略对于静态资源没有限制，而对 AJAX 请求有限制，而 CORS 可以 解决 AJAX 同源策略限制。

CORS 其需要前后端配合使用，单独前端无法解决 cors 跨域。后端配合关键是 http response header 中的一些参数

- Access-Control-Allow-Origin 接口允许的 origin 列表
- Access-Control-Allow-Methods 接口允许的方法，可以是 `GET,PUT,POST,OPTIONS` 等
- Access-Control-Allow-Headers header 设置， 比如 `X-PINGOTHER, Content-Type`
- Access-Control-Max-Age `OPTIONS` 预检请求缓存当前接口使用， 默认 5s
- Access-Control-Allow-Credentials 前端请求是否携带 `Cookie`信息， 由于 cookie 特性，需要指定 origin

## 浏览器跨域请求

浏览器跨域请求会将 HTTP 请求分为两种： 简单请求 ，特殊请求

### 简单请求

简单请求必须满足 2 个条件

1. 请求方法限制: `GET, POST, HEAD`

2. 请求头不超过以下几个字段

- Accept
- Accept-Language
- Content-Type: 局限 3 中 `application/x-www-form-urlencoded`, `multipart/form-data` 和 `text/plain`

同时，浏览器自动添加一个 Origin 字段，供服务器判断是否允许访问当前接口

浏览器通过 `Origin` 这个字段决定是否允许跨域请求操作，如果允许跨域请求操作，则会返回如下 HTTP Header 字段

- Access-Control-Allow-Origin 接口允许的 origin 列表
- Access-Control-Allow-Credentials 前端请求是否携带 `Cookie`信息， 由于 cookie 特性，需要指定 origin, 此时 origin 不能是通配符 `*`
- Access-Control-Expose-Headers header 指定前端能够访问到的 header 字段， 这个很少遇到特殊处理

### 特殊请求

特殊请求，是除了简单请求之外的请求，不如 PUT, DELETE 请求等。

特殊请求有预检（preflight） 阶段，通过预检确定服务器是否允许请求，以及允许携带的参数信息。

#### OPTIONS 预检

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
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.status(200).end();
  }
});
```

## 参考

1. [跨域资源共享 CORS 详解 | 阮一峰](https://www.ruanyifeng.com/blog/2016/04/cors.html)
2. [跨域问题（CORS）的解决 | 知乎](https://zhuanlan.zhihu.com/p/121042077)

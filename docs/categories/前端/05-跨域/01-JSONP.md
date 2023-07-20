---
title: JSONP
date: '2023-02-26'
udate: '2023-02-26'
---

# JSONP

JSONP 利用 `script` 标签自带的跨域功能，通过 浏览器自动执行 script 下载返回脚本来解决跨域请求。

JSONP 实现需要

1. 客户端通过 `script` 的 `GET` 请求服务端接口
2. 服务端将需要返回的 data 数据，包裹在 script 的 url 的 `callback=fn` 中的 `fn` 中，也就是返回值是 `fn(data)`
3. 客户端获取返回值 `fn(data)`，作为 script 脚本执行，此时前端正好有个名称为`fn` 的方法，获取 data 内容

## JSONP 实现示例

### 前端代码

```html
<script>
  var script = document.createElement('script');
  script.type = 'text/javascript';

  // 传参一个回调函数名给后端，方便后端返回时执行这个在前端定义的回调函数
  script.src = 'http://a.liuzunkun.com?foo=&bar=&callback=fn';

  document.head.appendChild(script);

  // 回调执行函数
  function fn(data) {
    console(data);
  }
</script>
```

注意
前端的 script 请求不携带 origin 和 cookie 等信息，因此后端可能无法验证用户信息。

同时 script 跨域请求还有安全隐患。

为此，可以设置 script 的 crossorigin 属性，比如 `script.crossorigin = 'use-credentials'` 其有两个值

- anonymous 采用 cors 请求头，但是跨域不携带 cookie 等信息，同域下携带
- use-credentials 使用 cors 请求方式，同时设置 `credentials=include`

### 后端示例

```js
var querystring = require('querystring');
var http = require('http');
var server = http.createServer();

server.on('request', function (req, res) {
  var params = qs.parse(req.url.split('?')[1]);
  var fn = params.callback;

  // jsonp返回设置
  res.writeHead(200, { 'Content-Type': 'text/javascript' });
  res.write(fn + '(' + JSON.stringify(params) + ')');

  res.end();
});

server.listen('8080');
console.log('Server is running at port 8080...');
```

## JSONP 注意事项

1. JSONP 只能发起 GET 请求
2. JSONP 需要服务端配合
3. JSONP 有 CSRF 安全问题，服务端可以验证 Refer

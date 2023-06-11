---
title: HTTP Location 处理
date: '2023-06-11'
udate: '2023-06-11'
---

# HTTP Location 处理

有很长一段时间，我以为只要后端返回值设置了`location` 字段，前端会自动根据这个字段跳转相应的页面，直到在做 sso 登录跳转时才发现不是这样，需要做如下区分

## 浏览器 url 访问接口

我们假设 应用 `http://liuzunkun1.com` 在登录阶段访问了 `sso.liuzunkun.com`进行登录操作，访问地址如下

```js
http://sso.liuzunkun.com/auth/login?callback=http://liuzunkun1.com
```

SSO 后端通过 session 验证用户在当前浏览器已经登录过，于是设置重定向操作

```js
ctx.status = 302; // 默认操作
ctx.redirect(`http://liuzunkun1.com?ticket=`);
```

此时浏览器接收到重定向地址，则直接跳转到了 `http://liuzunkun1.com?ticket=` 页面

## JS 请求接口

JS 请求接口常用的方是有 `xhr`, `fetch`, `axios`, 等操作， 这些方法接收到 http `location` 重定向字段后，并不会主动处理，需要我们在代码中手动跳转页面

js http 请求接口需要获取请求返回的 `responseURL`字段

### xhr

```js
const xhr = new XMLHttpRequest();
xhr.open('GET', 'http://example.com/test', true);
xhr.onload = () => {
  console.log(xhr.responseURL); // http://example.com/test
};
xhr.send(null);
```

### fetch

fetch 需要判断 `res.redirected` 字段，获取 `res.url` 这个地址来重新跳转。

方式有 `window.location.href=res.url` 或 `window.location.replace(res.url)`

```js
function logout() {
  const uid = document.getElementById('uid').innerText;

  fetch(`/auth/logout?uid=${uid}`, {
    method: 'GET',
  }).then(res => {
    sessionStorage.clear();
    localStorage.clear();

    let url;
    if (res.redirected) {
      url = res.url;
    } else {
      url = '/';
    }

    window.location.href = url;
  });
}
```

### axios

使用 `response.request.responseURL` 或 `response.config.url` 作为最终的地址

参考 https://github.com/axios/axios/discussions/4571

::: tip 引用回答
You can access it by accessing `response.config.url` or `response.request.responseURL`, though if you only want the URI you would need to use regex or you could use JS by utilizing a array or string method.
:::

## 参考

1. [Redirections | MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Redirections)
2. [responseURL | MDN](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseURL)
3. [Response | MDN](https://developer.mozilla.org/en-US/docs/Web/API/Response/redirected)
4. [axios | github](https://github.com/axios/axios/discussions/4571)

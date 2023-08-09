---
title: Cookie要点
date: '2023-08-07'
udate: '2023-08-07'
---
# Cookie要点
Cookie 常用在前端存储会话信息，是浏览器存储的一种手段。有存储数据数量有限，安全性差的缺点。


## Cookie创建
服务端通过 HTTP 头中 `Set-Cookie` 字段设置 Cookie 相关信息。格式如
```shell
Set-Cookie: uid=xx;path=/
Set-Cookie: sessionId=xxx; expires=xxx; httpOnly
```

## 生命周期
Cookie 的生命周期可以通过两种方式定义：
1. 会话期 Cookie（没有设置 `Expires` 或 `Max-Age`) 存在浏览器会话期间，浏览器关闭会清除Cookie，凡事有例外
2. 持久性 Cookie 通过 `Expires` 或 `Max-Age` 保存了 Cookie 信息，即使浏览器关闭也会存储。

## 作用域
Cookie 作用域设置涉及 `Domain` 和 `Path` 和 `SameSite`

### Domain 
Domain 一般指 `HOST` ,区别于同源策略中的 `Origin` ，所以不存在协议和端口不同而影响 Cookie作用域。
1. 不指定 Domain, 则默认是当前 Host， 子Host不共享Cookie
2. 指定了Domain，则可以作用于子Host，比如 `Set-Cookie: uid=111; Domain=liuzunkun.com` 则可以作用在 `a.liuzunkun.com` 上。

### Path
Path 指定 URL 地址，则可以作用在请求的URL和其子路径中，比如设置了 `Path=/docs`,
可以作用在 `/docs, /docs/, /docs/xxx` 而不作用于 `/docsx`

注意如果 `Path=/` 是不是说可以在 `/` 路径下共享当前 Cookie 了。

### SameSite
SameSite指定跨站请求是否允许发送 Cookie， 有如下 3 中选项
- None 不指定，则同域和跨站请求发送Cookie
- Strict 同站请求发送Cookie，跨站请求则不包括指定了 strict 的 cookie
- Lax MDN说是浏览器默认值，和 Strict 类似，存在于链接中(不是很明白)

## 安全属性
Cookie 常被认为是不安全的。Cookie 的安全属性涉及到 `Secure` 和 `httpOnly`

### Secure
Secure 属性 需要通过 `https` 发送给服务端，因此无法通过 `http` 协议拦截获取。

### httpOnly
这个属性是为了防止前端 JS 脚本获取到当前 Cookie信息，防止 `XSS` 攻击

```shell
Set-Cookie: id=a3fWa; Expires=Wed, 21 Oct 2015 07:28:00 GMT; Secure; HttpOnly
```

## 参考
1. [Cookie | MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Cookies)
2. [Cookie详解  | 知乎](https://zhuanlan.zhihu.com/p/101315335)

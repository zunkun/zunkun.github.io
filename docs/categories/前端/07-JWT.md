---
title: JWT
date: '2023-07-12'
udate: '2023-07-12'
---

# JWT

## JWT 是什么

JWT(JSON WEB TOKEN)，常用来做验证用户信息。由服务端签发的 token 给用户，用户携带 token 访问资源服务器，资源服务器验证 token，从而确认用户信息以及权限。

JWT 不需要在服务端存储，因此签发 token 对于服务器来说是无状态的。

JWT 的缺点是： 一旦签发出去的 token，便无法撤销 token，除非服务端做其他操作处理当提前 token。
下面是 JWT 示例

`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMDAwMCIsInVzZXJOYW1lIjoibGl1enVua3VuIn0.pDgMxETnNMN5XPMFgDTcnxviI2-mMFHbMOzBuH5RMpY`

## JWT 工作流程

1. 用户通过认证服务器，获得 token
2. 用户请求资源时携带 token, 使用方法是 HTTP header `Authorization: Bearer token`
3. 资源服务器验证 token，成功则返回相应资源

![JWT](/img/jwt.png)
图片来源: https://docs.authing.cn/v2/concepts/jwt-token.html

## JWT 算法

JWT 算法是

```js
const token =
  base64urlEncoding(header) + '.' + base64urlEncoding(payload) + '.' + base64urlEncoding(signature);
```

1. header

header 部分标记使用那种算法生成 signature。比如

```js
{
  "alg": "HS256",
  "typ": "JWT"
}

```

2. payload

需要签名的信息，比如用户信息

```js
{
  "userId": "10000",
  "userName": "liuzunkun"
}
```

3. signature
   签名，用来验证 token, 算法如下

```js
HMAC_SHA256(secret, base64urlEncoding(header) + '.' + base64urlEncoding(payload));
```

其中 secret 验证服务端存储，不可泄露

## 实现

```js
const crypto = require('crypto');

const header = {
  alg: 'HS256',
  typ: 'JWT',
};

const payload = {
  userId: '10000',
  userName: 'liuzunkun',
};

function base64UrlEncode(str) {
  return Buffer.from(str).toString('base64url');
}

// 密钥
const secret = 'liuzunkun';

const base64Header = base64UrlEncode(JSON.stringify(header));
const base64Payload = base64UrlEncode(JSON.stringify(payload));

const data = `${base64Header}.${base64Payload}`;
var reg = new RegExp('/', 'g');
// 计算 HMAC-SHA256 摘要
const signature = crypto.createHmac('sha256', secret).update(data).digest('base64url');

const token = `${base64Header}.${base64Payload}.${signature}`;
```

## 参考

1. [了解 JWT Token 释义及使用](https://docs.authing.cn/v2/concepts/jwt-token.html)
2. [JWT](https://jwt.io/introduction)
3. [JWT|WIKI](https://en.wikipedia.org/wiki/JSON_Web_Token)
4. [Base64](https://en.wikipedia.org/wiki/Base64#URL_applications)

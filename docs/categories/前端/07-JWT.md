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

function JWT(options = {}) {
  const { secret = 'liuzunkun.com', exp = 60 * 60 * 1000 } = options;

  const header = {
    alg: 'HS256',
    typ: 'JWT',
  };

  function base64urlEncoding(str) {
    return Buffer.from(str).toString('base64url');
  }

  function sign(data) {
    if (Object.prototype.toString.call(data) !== '[object Object]') {
      throw new Error('data must be an object');
    }
    const payload = {
      ...data,
      exp: Date.now() + parseInt(exp, 10),
    };

    // 密钥
    const base64Header = base64urlEncoding(JSON.stringify(header));
    const base64Payload = base64urlEncoding(JSON.stringify(payload));

    console.log({
      base64Header,
      base64Payload,
    });

    const signature = crypto
      .createHmac('sha256', secret)
      .update(`${base64Header}.${base64Payload}`)
      .digest('base64url');

    const token = `${base64Header}.${base64Payload}.${signature}`;
    return token;
  }

  function validate(token) {
    if (typeof token !== 'string') {
      throw new Error('token must be a string');
    }

    if (token.indexOf('Bearer ') === 0) token = token.slice(7);

    const tokenArr = token.split('.');

    if (tokenArr.length !== 3) {
      throw new Error('Invalid token');
    }

    const base64Header = tokenArr[0];
    const base64Payload = tokenArr[1];
    const signature = tokenArr[2];

    const targetSignature = crypto
      .createHmac('sha256', secret)
      .update(`${base64Header}.${base64Payload}`)
      .digest('base64url');

    if (targetSignature !== signature) {
      throw new Error('Invalid token');
    }

    const payloadStr = Buffer.from(base64Payload, 'base64url').toString('utf-8');
    const data = JSON.parse(payloadStr);

    if (parseInt(data.exp, 10) < Date.now()) {
      throw new Error('token has expired');
    }

    return data;
  }

  return {
    sign,
    validate,
  };
}

const secret = 'liuzunkun';
const data = { userId: '10000', userName: 'liuzunkun' };

const jwt = new JWT({ secret });

const token = jwt.sign(data);

console.log({ token });

const data2 = jwt.validate(token);

console.log({ data2 });
```

## 参考

1. [了解 JWT Token 释义及使用](https://docs.authing.cn/v2/concepts/jwt-token.html)
2. [JWT](https://jwt.io/introduction)
3. [JWT|WIKI](https://en.wikipedia.org/wiki/JSON_Web_Token)
4. [Base64](https://en.wikipedia.org/wiki/Base64#URL_applications)

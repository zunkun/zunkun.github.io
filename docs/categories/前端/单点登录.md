---
title: 单点登录
date: '2023-05-31'
udate: '2023-05-31'
---

# 单点登录

项目源码地址: https://gitee.com/zunkun/sso

单点登录(SSO)，常用来减少在各个系统中登录的次数，实现一个应用登录，其他应用也同步登录状态，一个应用注销，其他应用也相应注销。

单点登录的核心是 `cookie`，通过 `cookie` 配合 `session`, 获取用户信息。

原理如下图

![SSO](/img/sso.jpg)

## 同域下单点登录

假设有两个应用 `a.liuzunkun.com`， `b.liuzunkun.com` 和 和 sso 服务 `sso.liuzunkun.com`。 当我们在 `sso.liuzunkun.com` 上登录成功，我们将登录的 `cookie` 设置的 `origin =  'liuzunkun.com'`, 这样只要保证 a 和 b 两个应用都存在登录状态的 cookie 。

## 不同域下单点登录

不同域下的 cookie 不能共享，因此 通过设置 cookie 的 origin 这条路走不通。

我们需要维护 sso 自身的全局 session 信息，同时应用 a,b 维护自身登录的 session 信息。

### 1. 登录操作

1. 我们的 应用 `liuzunkun1.com` , `liuzunkun2.com` 和 sso 各自维护自身的登录 session
2. 当应用 `liuzunkun1.com` 未登录时，我们跳转到 sso 登录页面，地址是 `http://sso.liuzunkun.com/login?redirect=liuzunkun1.com`
3. sso 登录界面检查当前 sso 是否是登录状态，若已经登录， 则跳转回应用 a，同时携带用户识别用户身份的 `ticket`， 比如 `http://liuzunkun1.com?ticket=`
4. 若是上面步骤中 sso 未登录，则显示 sso 登录表单，sso 登录成功后，将 sso 登录 session 写入 sso 页面，同时跳转回上述 a 应用，并携带 `ticket`
5. 应用 `liuzunkun1.com` 服务端通过 ticket 请求 sso，验证当前 ticket，并得到当前用户信息
6. 应用 `liuzunkun1.com` 维护自身的局部登录状态
7. 应用 `liuzunkun2.com` 登录也是重复上述步骤

### 2. 注销操作

注销操作比较复杂，我们在一个应用注销后，注销全局 sso 中当前用户登录 session, 同时通知所有注册当前 session 登录的应用， 执行注销操作。

1.  `liuzunkun1.com` 内部注销，清除自身引用的 session
2.  `liuzunkun1.com` 通知 sso 注销当前用户，参数为当前用户的 uid
3.  sso 收到请求，清除 sso 所有当前用户的 session
4.  `liuzunkun1.com` 成功返回，页面跳转到首页，通过登录状态再次跳转到 sso 登录页面，走登录流程

## 关键步骤说明

### 1. SSO 登录页处理

假设 sso 登录页面的地址是 `/auth/login`, 用户进入当前页面的处理规则

1. 根据 session 获取用户信息 user ， 不存在则渲染登录表单
2. 当前用户已经登录，如果 query params 中 redirect 表示当前登录页来自其他应用跳转，则根据用户信息生成 ticket 返回原应用 app 页面，供 app 验证用户信息。
3. 当前用户已经登录，渲染主页

```js
/**
 * 登录页面
 */
router.get('/login', async (ctx, next) => {
  const { user } = ctx.session;
  const { appName } = process.env;

  if (user && user.id) {
    if (ctx.query.redirect) {
      const ticket = genUserTicket(user);

      ctx.redirect(`${ctx.query.redirect}?ticket=${ticket}`);
      return;
    }

    ctx.redirect('/', { user });
    return;
  }
  await ctx.render('login', { appName });
  next();
});
```

### 2. SSO 登录表单验证

和常见登录操作没有区别，需要注意的是，登录成功后需要做如下操作

1. 保存当前会话的用户信息到 session , `ctx.session.user = user;`
2. 如果当前登录页来自第三方应用跳转，则生成 ticket 返回第三方应用
3. 否则登录成功渲染首页

```js
router.post('/login', async (ctx, next) => {
  const { body, query } = ctx.request;

  const { name, password } = body;

  const user = await validateUserPwd(name, password);
  if (!user) {
    ctx.body = { error: 1, message: '用户名或密码错误' };
    return;
  }
  ctx.session.user = user;

  if (query.redirect) {
    const ticket = genUserTicket(user);
    ctx.redirect(`${query.redirect}?ticket=${ticket}`);
    return;
  }

  ctx.redirect('/');
  next();
});
```

### 3. ticket 生成和验证

这里使用比较简单 ticket 生成和验证方法

#### 生成 ticket

ticket 组成格式 `ticket = prefix:uid:ts:hash`

- prefix: tickiet 指示作何用处， 如 signin 登录 ticket, signout 注销登录 ticket
- uid: 用户 id
- ts： 时间戳，加上过期时间, 比如 `const ts = Date.now() + 5 * 60 * 1000;` 设置 ticket 在 5 min 内有效
- hash: 根据 uid 和 ts 生成 hash, 为了增加破解难度，同时减少存储 salt 复杂度，这里采用 salt = ts.reverse()

```js
/**
 * 生成ticket
 * @param {string} uid user uid
 * @param {string} prefix ticket prefix
 * @returns
 */
function genUserTicket(uid, prefix = 'signin') {
  const ts = Date.now() + 5 * 60 * 1000;
  const key = `${uid}:${ts}`;
  const salt = ts.toString().split('').reverse().toString();
  const { hash } = cryptMsg(key, salt);
  return `${prefix}:${uid}:${ts}:${hash}`;
}
```

cryptMsg 采用 md5 算法

```js
/**
 * 加密信息
 * @param {string} message
 * @param {string|number} salt salt
 * @returns {string} hash hash
 * @returns {string} salt salt
 */
function cryptMsg(message = '', salt = getRandomStr()) {
  const saltMsg = `${message}:${salt}`;
  const md5 = crypt.createHash('md5');
  const hash = md5.update(saltMsg).digest('hex');

  return {
    salt,
    hash,
  };
}
```

#### 验证 ticket

根据 ticket 生成规则，逆向处理, 验证成功后，根据 uid 返回用户信息

```js
async function validateTicketUser(ticket = '') {
  if (typeof ticket !== 'string') return false;
  const arr = ticket.split(':');
  if (!Array.isArray(arr) || arr.length !== 4) return false;

  const prefix = arr[0];
  const uid = arr[1];
  const ts = parseInt(arr[2], 10);
  const targetTicket = arr[3];
  const key = `${uid}:${ts}`;
  const salt = ts.toString().split('').reverse().toString();

  if (ts < Date.now()) return false;

  const { hash } = cryptMsg(key, salt);

  if (hash !== targetTicket) return false;

  let user;
  if (prefix === 'signin') {
    user = await getSessionByUid(uid);
  } else if (prefix === 'signout') {
    user = await getUserByUid(uid);
  }

  return user;
}
```

上面代码中 `genSessionByUid`获取当前 sso 用户登录 session 是否存在，否则认定为非法

```js
async function getSessionByUid(uid) {
  const userSessionKey = `user.${uid}`;
  const userSessList = sessionDb.get(userSessionKey).value() || [];

  if (!userSessList.length) return null;

  let user;

  userSessList.forEach(key => {
    const sessionKey = `session.${key}`;

    const sess = sessionDb.get(sessionKey)?.value();
    // eslint-disable-next-line no-underscore-dangle
    if (sess && sess._expire) {
      user = sess.user;
    } else {
      userSessList.delete(key);
      sessionDb.unset(sessionKey).write();
    }
  });

  sessionDb.set(userSessionKey, userSessList).write();

  return user;
}
```

同时 router 信息如下

```js
router.post('/validate', async (ctx, next) => {
  const { ticket } = ctx.request.query;

  const user = await validateTicketUser(ticket);
  if (!user) {
    ctx.body = {
      error: 1,
      message: '验证失败',
    };
    return;
  }

  ctx.body = { error: 0, messae: null, user };
  next();
});
```

### 3. session 存储

这里采用的是 `koa-session` 的存储方案, 存储方式采用了 `lowdb@1.0` 版本本地存储，更好处理方式是使用 `redis` 或 `MongoDB` 等方案。

下面是 koa 注册 session 插件的方案 `app.use(session(CONFIG, app));`

注意 不同应用根据名称 存储在不同位置，同时 session key 的名称不同 `CONFIG.key = `koa.sess${appName}`;`

```js
function register(app) {
  // const sessionDb = new SessionDb();
  const { appName } = process.env;

  const CONFIG = {
    key: 'koa.sess' /** (string) cookie key (default is koa.sess) */,
    maxAge: 86400000,
    httpOnly: true,
    signed: false,

    store: {
      async get(key) {
        const sessionKey = `session.${key}`;
        const sess = sessionDb.get(sessionKey)?.value();
        return sess;
      },
      async set(key, sess, maxAge, { rolling, changed }) {
        if (!rolling && !changed) return sess;
        const sessionKey = `session.${key}`;
        sessionDb.set(sessionKey, sess).write();

        // 更新 user session key list
        if (sess?.user?.id) {
          const userSessionKey = `user.${sess.user.id}`;
          const userSessList = sessionDb.get(userSessionKey).value() || [];

          userSessList.push(key);
          sessionDb.set(userSessionKey, userSessList).write();
        }

        return sess;
      },
      async destroy(key) {
        const sessionKey = `session.${key}`;

        const sess = sessionDb.get(sessionKey).value();
        // destroy key from session key list
        if (sess?.user?.id) {
          const userSessionKey = `user.${sess.user.id}`;
          let userSessList = sessionDb.get(userSessionKey).value() || [];

          userSessList = userSessList.filter(item => item !== key);

          if (!userSessList.length) {
            sessionDb.unset(userSessionKey).write();
          } else {
            sessionDb.set(userSessionKey, userSessList).write();
          }
        }

        sessionDb.unset(sessionKey).write();

        return true;
      },
    },
  };

  if (appName) {
    CONFIG.key = `koa.sess${appName}`;
  }

  app.use(session(CONFIG, app));
}
```

### 4. 退出登录清空登录 session 处理

应用注销登录时除了注销自身的 session, 还要通知其他应用注销 session， 在 app 则需要通知 sso，在 sso 需要通知注册的所有其他应用。

#### 1. app 注销

router 接收参数

- uid 指示需要注销哪个用户
- ticket 验证从 sso 发来的注销登录请求

如果没有这两个参数，则只清除自身的 session

```js
router.get('/auth/logout', async (ctx, next) => {
  ctx.session = null;

  const uid = ctx.query.uid || ctx.session?.user?.id;
  const { ticket } = ctx.query;

  if (uid) {
    if (ticket) {
      // sso 通知当前应用清理 session
      const ticketRes = await validateTicket(ticket);
      if (ticketRes.error === 1) {
        ctx.body = ticketRes;
        return;
      }

      clearUserSession(uid);
    } else {
      // 通知全局 sso 清理 session
      await notifyClearSession(uid, 'sso');
    }
  }

  ctx.session = null;
  ctx.body = { error: 0, message: null };
  next();
});
```

上面的 `clearUserSession` 则时 sso 通知当前应用注销用户 uid 的 session

```js
async function clearUserSession(uid) {
  console.log(`${process.env.appName}清理所有 user session`, uid);
  // const sessionDb = new SessionDb();
  const { appName } = process.env;

  const userSessionKey = `user.${uid}`;
  const userSessList = sessionDb.get(userSessionKey).value() || [];

  if (!userSessList.length) return true;

  userSessList.forEach(key => {
    const sessionKey = `session.${key}`;

    sessionDb.unset(sessionKey).write();
  });

  sessionDb.unset(userSessionKey).write();

  return true;
}
```

`notifyClearSession` 用处时通知其他应用注销 uid 的 session， 因此，app 只需要通知 sso 注销 session 即可

```js
function notifyClearSession(uid, appName) {
  if (!uid || !appName) return { error: 1, message: '参数错误' };

  console.log(`${process.env.appName}：通知 ${appName} 清理 ${uid} session`);
  const options = {
    method: 'get',
    baseURL: `http://${config[appName].host}:${config[appName].PORT}`,
    url: '/auth/logout',
    params: {
      uid,
      ticket: genUserTicket(uid, 'signout'),
    },
    responseType: 'json',
  };

  return axios(options)
    .then(res => {
      console.log(`${process.env.appName}：通知 ${appName} 清理 ${uid} session 成功`);
      return res.data;
    })
    .catch(() => {
      console.log(`${process.env.appName}：通知 ${appName} 清理 ${uid} session失败`);
      return {
        error: 1,
        message: `${process.env.appName}：通知 ${appName} 清理 ${uid} session失败`,
      };
    });
}
```

#### 2. sso 注销

sso 的注销有两种来源

- 自身应用前端注销操作
- app 应用通知来的注销

在注销操作时，除了清除自身的 session 外，还要通知 所有注册的 app 注销 session， 代码可以如下写

```js
async function clearUserSession(uid) {
  console.log(`${process.env.appName}清理所有 user session`, uid);
  // const sessionDb = new SessionDb();
  const { appName } = process.env;

  const userSessionKey = `user.${uid}`;
  const userSessList = sessionDb.get(userSessionKey).value() || [];

  if (!userSessList.length) return true;

  userSessList.forEach(key => {
    const sessionKey = `session.${key}`;

    sessionDb.unset(sessionKey).write();
  });

  sessionDb.unset(userSessionKey).write();

  if (appName !== 'sso') return true;

  // SSO 通知其他应用清空当前用户的局部 session
  const subAppNames = Object.keys(config).filter(item => item !== 'sso');

  try {
    subAppNames.forEach(subAppName => {
      notifyClearSession(uid, subAppName);
    });
  } catch (error) {
    console.log(error);
  }

  return true;
}
```

## 参考

1. [SSO 和 Oauth2 的区别 | 掘金](https://juejin.cn/post/7128960112743415845)
2. [sso 和 oauth2.0 的区别是什么？| 知乎](https://www.zhihu.com/question/53191860)
3. [单点登录（SSO）看这一篇就够了](https://developer.aliyun.com/article/636281)
4. [koa-session](https://github.com/koajs/session)

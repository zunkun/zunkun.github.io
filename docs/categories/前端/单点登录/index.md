---
title: 单点登录
date: '2023-05-31'
udate: '2023-05-31'
---

# 单点登录

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

## 参考

[SSO 和 Oauth2 的区别 | 掘金](https://juejin.cn/post/7128960112743415845)
[sso 和 oauth2.0 的区别是什么？| 知乎](https://www.zhihu.com/question/53191860)

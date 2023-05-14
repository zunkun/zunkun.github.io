---
title: iframe中postMessage通信
date: '2023-05-14'
udate: '2023-05-14'
---
# iframe中postMessage通信

假设使用了 `iframe` 引入第三方服务，访问后端接口时出现了跨域问题。某种原因，此时后端无法解决跨域。此时可以使用 `iframe` 与 其 `parent window` 通信，通过 `parent window`本身访问后端接口。这就用到了 `postMessage` 这个接口。

## postMessage
::: tip MDN
The postMessage() method of the Client interface allows a service worker to send a message to a client (a Window, Worker, or SharedWorker). The message is received in the "message" event on navigator.serviceWorker.
:::

1. iframe 中调用 postMessage
```js
// parent.postMessage(message, targetOrigin);
parent.postMessage({type: 'saveUML'}, '*')

```

2. 父窗口接收消息
```js

window.addEventListener('message', (event) => {
  // 拦截非指定消息来源
  if(event.orogin !== fromorigin) return;

  // 获取消息
  const { data } = event;

  console.log({ data });
})

```


## 参考

[postMessage | MDN](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage)





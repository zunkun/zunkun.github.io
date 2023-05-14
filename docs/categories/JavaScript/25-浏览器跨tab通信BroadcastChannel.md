---
title: 浏览器跨tab通信BroadcastChannel
---
# 浏览器跨tab通信BroadcastChannel
假设我们有个服务，拥有窗口 `window1` ,新开了一个浏览器tab `window2`， 在新的tab页面我们做了一些数据修改，保存操作，我们想要在原先的浏览器窗口 `window1`中显示最新的数据状态。

因此，需要 `window2` 向 `window1` 发送信息， `window1` 接受来自 `window2` 的信息。这里使用到了 `BroadcastChannel`， 广播通信。

::: danger 注意
`BroadcastChannel` 只能在相同 origin 下通信, 不能跨域。
:::

## BroadcastChannel
::: tip
The BroadcastChannel interface represents a named channel that any browsing context of a given origin can subscribe to. It allows communication between different documents (in different windows, tabs, frames or iframes) of the same origin. Messages are broadcasted via a message event fired at all BroadcastChannel objects listening to the channel, except the object that sent the message.
:::

### window2 发送信息
```js
const bc = new BroadcastChannel('uml');
// 通知 window1 刷新页面
bc.postMessage({type: 'refresh'});


// 通信结束
bc.close()

```

### window1 接收信息

```js
const bc = new BroadcastChannel('uml');

// 接收信息
bc.addEventListener('message', (event) => {
  // 接受到的信息
  const { data } = event;

  console.log({ data })
})

// 通信结束
bc.close()
```

## 参考
[BroadcastChannel | MDN](https://developer.mozilla.org/en-US/docs/Web/API/BroadcastChannel)
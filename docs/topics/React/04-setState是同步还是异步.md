---
title: setState是同步还是异步
date: '2023-08-12'
udate: '2023-08-12'
---
# setState是同步还是异步
## 背景
查看讨论 [React 中 setState 什么时候是同步的，什么时候是异步的？](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/17)

V18版本中  `setState` 是异步的， 无论是否是合成事件，在任何地方都是异步。

V18 之前的版本，React 事件中是异步的，除此之外如 `setTimeout, setInterval, Promise`，以及原生事件中，是同步处理的。


## V18 中的 batching
这个机制的作用是将函数内部的 多个 setState 合成一个操作，表现出来的自然是异步效果。

:::tip Batching
Batching is when React groups multiple state updates into a single re-render for better performance.
:::

## V18 和 V17 区别

v18 版本

```jsx
function App() {
  const [count, setCount] = useState(0);
  const [flag, setFlag] = useState(false);

  function handleClick() {
    setCount(c => c + 1); // Does not re-render yet
    setFlag(f => !f); // Does not re-render yet
    // React will only re-render once at the end (that's batching!)
  }

  return (
    <div>
      <button onClick={handleClick}>Next</button>
      <h1 style={{ color: flag ? "blue" : "black" }}>{count}</h1>
    </div>
  );
}
```

v17 版本
```js
function App() {
  const [count, setCount] = useState(0);
  const [flag, setFlag] = useState(false);

  function handleClick() {
    fetchSomething().then(() => {
      // React 17 and earlier does NOT batch these because
      // they run *after* the event in a callback, not *during* it
      setCount(c => c + 1); // Causes a re-render
      setFlag(f => !f); // Causes a re-render
    });
  }

  return (
    <div>
      <button onClick={handleClick}>Next</button>
      <h1 style={{ color: flag ? "blue" : "black" }}>{count}</h1>
    </div>
  );
}
```

我们可以看到在V18中 多个 setState 操作不会立即更新 state, 而是在多个 setState 之后再更新。V17 版本即使是在非 React事件中，每次setState 操作都会出发 re-render 操作。

## V18 不使用 batch
``` jsx
import { flushSync } from 'react-dom'; // Note: react-dom, not react

function handleClick() {
  flushSync(() => {
    setCounter(c => c + 1);
  });
  // React has updated the DOM by now
  flushSync(() => {
    setFlag(f => !f);
  });
  // React has updated the DOM by now
}

```



## 参考
1. [React 中 setState 什么时候是同步的，什么时候是异步的？](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/17)
2. [When is setState asynchronous?](https://legacy.reactjs.org/docs/faq-state.html#when-is-setstate-asynchronous)
3. [Automatic batching for fewer renders in React 18 ](https://github.com/reactwg/react-18/discussions/21)

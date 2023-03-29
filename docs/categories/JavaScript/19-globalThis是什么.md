---
title: globalThis是什么
date: '2023-03-29'
udate: '2023-03-29'
---
# globalThis是什么

## 简单介绍

`globalThis` 是获取全局对象的方法，因为 JS 会在不同运行环境中，比如浏览器，nodejs，iframe 中，不同环境中获取全局对象方法不同。

运行环境：浏览器窗口中获取全局对象使用 `window`、`self`、和 `iframes`， 而 nodejs 中使用 `global` , 

函数运行时，非严格模式下，函数内部返回 `this` 获取全局对象，而严格模式中 `this` 返回  `undefined`

nodejs 环境中由于 文件被包装成模块，因此 文件中 this 指向当前模块，此时 `this !== global`

因此，`globalThis` 用来兼容获取全局对象， 比如在 nodejs 中

```js
global.a = 4;
this.a = 5;

const obj = {
  a: 1,
  b() {
    console.log(this.a); // 1

    console.log(global.a); // 4
  },
  c: {
    a: 3,
    d() {
      console.log(this.a); // 3
    },
  },
  e: () => {
    console.log(this.a); // 5
  },
};

obj.b();
obj.c.d();
obj.e();

console.log(this); // {a: 5}
console.log(globalThis === global); // true
```
globalThis 指向 global

## globalThis实现
```js
var getGlobal = function () {
  if (typeof self !== 'undefined') { return self; }
  if (typeof window !== 'undefined') { return window; }
  if (typeof global !== 'undefined') { return global; }
  throw new Error('unable to locate global object');
};

var globals = getGlobal();

```


## 参考

1. [MDN-globalThis](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/globalThis)

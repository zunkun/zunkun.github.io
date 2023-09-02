---
title: currying柯里化函数
date: '2023-09-02'
udate: '2023-09-02'
---

# currying 柯里化函数

## 背景

1. 假设我们实现一个加法计算器，函数式 `sum(a,b,c,d)`, 我们的参数不是一次获取，我们这样执行`sum(1)(2,3)(4)`，我们如何处理呢？

2. 有个验证正则的函数 `checkByRegExp(regex, str)`， 当我们验证邮箱是使用 `checkByRegExp(/^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/,"liu@aliyun.com")`, 当我们验证手机号是使用 `checkByRegExp(/^1\d{10}$/, '123456')`， 如果我们如下使用

```js
let curriedCheck = curry(checkByRegExp);
let checkPhone = curriedCheck(/^1\d{10}$/);
let checkEmail = curriedCheck(/^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/);
checkPhone(1234455);
checkPhone(1234456);
checkPhone(1234457);

checkEmail('a@aliyun.com');
checkEmail('a@aliyun.com');
checkEmail('a@aliyun.com');
```

这样代码复杂了，但是结构更清晰。

## 实现原理

柯里化函数接收参数并不马上执行，而是返回一个新的函数，这个函数可以继续接收参数，直到执行条件满足，执行函数。

可以看到柯里化函数需要将接收到的参数缓存起来。

## 实现代码

说明: curry 每次接收参数，则返回一个新的函数，并将参数缓存传递给下一个函数，直到满足执行条件，我们取接收参数长度 >= 原函数形参长度执行原函数

```js
function curry(fn) {
  // 返回一个函数，用来存储参数，当参数数目正确是，执行函数
  return function _curryed(...args) {
    // 当接收到的参数长度 >= 原函数的参数长度时，执行原函数
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }

    // 当接收参数不足时，返回一个新的函数用来接收参数
    return function (...args2) {
      return _curryed.apply(this, args.concat(args2));
    };
  };
}
```

## 示例

```js
function sum(a, b, c, d) {
  return a + b + c + d;
}

const curryedSum = curry(sum);

// 参数不足，不执行
console.log(curryedSum(1, 2));
// 参数不足，不执行
console.log(curryedSum(1, 2, 3));
// 参数不足，不执行
console.log(curryedSum(1)(2)(3));
// 执行
console.log(curryedSum(1, 2, 3, 4));
// 执行
console.log(curryedSum(1)(2, 3)(4));
```

## 参考

1. JavaScript 设计模式与开发实践
2. [柯里化|javascript.info](https://zh.javascript.info/currying-partials)
3. [「前端进阶」彻底弄懂函数柯里化|掘金](https://juejin.cn/post/6844903882208837645)

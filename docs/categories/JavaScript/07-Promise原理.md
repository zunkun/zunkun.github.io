---
title: Promise原理
date: '2023-03-05'
udate: '2023-03-05'
---
# Promise原理
Promise 是一个类，传入执行器执行

Promise 存在三种状态, 任何时候都只存在其一种状态中。
1. 待定 pending
2. 兑现 fullfilled
3. 拒绝 rejected

Promise 状态改变，只能从 pending -> resolved 或 pending  -> rejected ，变化后不再变化。

Promise 成功 后执行成功 fulfilled cb，失败执行 rejcted cb

![promise](/img/promises.png)

## Promise 常用方法
### Promise.prototype.then
fullfilled 后 进入下一个调用， then 进入下一个 promise

### Promise.prototype.catch
rejected 后 对错误的处理

### Promise.prototype.finally
在 promise 结束时，无论结果是 fulfilled 或者是 rejected，都会执行指定的回调函数。


### Promise.all
接受一个 iterate(Array, Map, Set 等) 的promise实例，并返回一个数组

特点： 所有 promise resolved 才能 resolved , 只要一个 promise rejected 则返回 reject

### Promise.any
正好跟 Promise.all 用处相反
1. 如果传入了一个空的可迭代对象，那么就会返回一个已经被拒的 promise
2. 如果传入了一个不含有 promise 的可迭代对象，那么就会返回一个异步兑现的 promise
3. 其余情况下都会返回一个处于等待状态的 promise。如果可迭代对象中的任意一个 promise 兑现了，那么这个处于等待状态的 promise 就会异步地（调用栈为空时）切换至兑现状态。如果可迭代对象中的所有 promise 都被拒绝了，那么这个处于等待状态的 promise 就会异步地切换至被拒状态。

### Promise.race
Promise.race(iterable) 方法返回一个 promise，一旦迭代器中的某个 promise 解决或拒绝，返回的 promise 就会解决或拒绝。

### Promise.allSettled

Promise.allSettled() 方法以 promise 组成的可迭代对象作为输入，并且返回一个 Promise 实例。当输入的所有 promise 都已敲定时（包括传递空的可迭代类型），返回的 promise 将兑现，并带有描述每个 promsie 结果的对象数组。


参考：

1. [MDN Promise](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise)
2. [Promise/A+](https://promisesaplus.com/)
3. [掘金](https://juejin.cn/post/6945319439772434469)

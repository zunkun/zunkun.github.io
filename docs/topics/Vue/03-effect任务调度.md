---
title: effect任务调度
date: '2023-05-28'
udate: '2023-05-28'
---
# effect任务调度
effect任务调度, 发生在 trigger 阶段执行 effectFn。

我们可以添加自己的任务调度来执行 effectFn， 为此需要对 effect 和 trigger 方法将进行改造。

## effect添加调度参数
通过 `options` 参数向 effectFn 传递参数

```js
// 副作用函数
function effect(fn, options = {}) {
  const effectFn = () => {
    // 清除所有与当前effectFn的关联关系, 防止
    // 1. effectFn重新执行时，旧的依赖关系已经变化， 
    // 比如 effectFn 和 obj1.key1, obj2.key2 建立关系，
    // 当前可能和ojb2.key2 不再有关系，所以需要清除
    // 2. 当前依赖关系可能已经不存在了，清除该关系, 
    // 比如 effectFn 和 obj1.key1 有关系，此时可能关系不在
    cleanup(effectFn);

    try {
      // 当前 active effectFn
      activeEffectFn = effectFn;
      effectFnStack.push(effectFn);

      // 执行 fn, 在fn内部执行时，会重新建立对象和当前effectFn的依赖关系
      fn();
    } finally {
      // 执行结束后操作，更新 activeEffectFn 和 effectFnStack
      effectFnStack.pop();
      activeEffectFn = effectFnStack[effectFnStack.length - 1];
    }
  };

  // 存储所有与当前副作用函数相关联的依赖集合
  effectFn.deps = [];
  effectFn.options = options;
  // 调用时执行
  effectFn();
}
```

## trigger 执行自定义调度任务
在执行调度 effectFn 时，判断是否有自定义调度任务 `sheduler`，优先执行

```js
// 执行 target, key 相关的副作用函数
function trigger(target, key) {
  // 获取 bucket 中 target 的 map关系
  const depsMap = bucket.get(target);
  if (!depsMap) return;

  // effectFn set
  const effects = depsMap.get(key);
  if (!effects) return;

  // 1. 为防止 effectFnStack 溢出，使用 effectFns 代替 effects,
  // 比如 effects.forEach(effectFn => effectFn()),
  // 此时 effectFn执行会执行cleanup, 而在 effectFn 内部又执行了 trigger，建立关系，这没问题，
  // 但是此时 effects 还在执行中，这个循环就不会结束，因此借用 effectFns 复制内部数据
  // 2. 为防止 effectFn 中 trigger 的 effectFn 与当前 activeEffectFn 相同，无限递归
  // 比如 effect(() => obj.num +=1)
  // const effectFns = new Set(effects);
  const effectFns = new Set();
  effects.forEach(effectFn => {
    if (effectFn !== activeEffectFn) {
      effectFns.add(effectFn);
    }
  });

  effectFns.forEach(effectFn => {
    // 如果有调度函数，则执行调度函数
    if (typeof effectFn.options.sheduler === 'function') {
      effectFn.options.sheduler(effectFn);
    } else {
      effectFn();
    }
  });
}

```

## 测试用例
```js

const data2 = { name: 'deshi', city: 'shanghai', gender: 'male', age: 30 };

const obj2 = reactive(data2);

const jobQueue = new Set();

// 微任务队列
const p = Promise.resolve();

// 正在刷新数据
let isFlushing = false;

// 刷新任务队列，等待任务队列刷新结束
function flushJob() {
  // 如果任务正在刷新，则等待
  if (isFlushing) return;
  isFlushing = true;

  p.then(() => {
    // 队列刷新结束，则执行 任务
    jobQueue.forEach(job => job());
  }).finally(() => {
    // 刷新对垒结束
    isFlushing = false;
  });
}

effect(
  () => {
    console.log(obj2.age);
  },
  {
    sheduler(fn) {
      // trigger 执行调度任务时，将副作用函数加入 jobQueue
      jobQueue.add(fn);
      // 刷新队列
      flushJob();
    },
  },
);

obj2.age++;
obj2.age++;
obj2.age++;
obj2.age++;
```

执行结果

```shell
30
34
```
为什么是这样呢？

1. `effect(callback, {sheduler})` 方法，先执行 `callback` 打印 `1`
2. 第一个`obj2.age++` 导致副作用函数调度执行， 此时执行`sheduler`, 将 callback 加入了 `jobQueue`， 同时执行 `flushJob`
3. 在 `flushJob` 内部， 当前 `isFlushing  = false`， 可以接着执行，同时设置`isFlushing = true`， 设置当前为刷新队列状态。
4. `p.then(() =>{...})` 微任务队列等待同步代码先执行，然后在执行
5. 第二个`obj2.age++` 执行，重复上面步骤， 此时 `isFlushing=true`, 返回不做操作，接下来几个`obj2.age++`也是如此
6. 同步代码执行结束，此时执行微任务队列 `p.then`, 执行 `jobQueue` 中的调度任务，此时只有一个调度任务，而此时`obj2.age = 34`

上面代码可以使用闭包处理

```js
function jobSheduler() {
  const jobQueue = new Set();
  // 微任务队列
  const p = Promise.resolve();
  // 正在刷新数据
  let isFlushing = false;

  // 刷新任务队列，等待任务队列刷新结束
  function flushJob(fn) {
    // 如果任务正在刷新，则等待
    if (isFlushing) return;
    jobQueue.add(fn);
    isFlushing = true;

    p.then(() => {
      // 队列刷新结束，则执行 任务
      jobQueue.forEach(job => job());
    }).finally(() => {
      // 刷新对垒结束
      isFlushing = false;
    });
  }

  return flushJob;
}

const shedulerFun = jobSheduler();

effect(
  () => {
    console.log(obj2.age);
  },
  {
    sheduler(fn) {
      // trigger 执行调度任务时，将副作用函数加入 jobQueue
      shedulerFun(fn);
    },
  },
);
```

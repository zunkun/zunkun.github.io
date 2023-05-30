---
title: watch实现
date: '2023-05-30'
udate: '2023-05-30'
---

# watch 实现

在 vue 中 watch 常用来监听相应数据发生变化，或者以 getter 数据发生变化，而触发相应数据, 使用方式如下:

```js
watch(object, cb(newValue, oldValue, onInvalidate));

watch(getter, cb(newValue, oldValue, onInvalidate));
```

参数说明

- object {object} 响应式对象
- getter {function} getter 数据
- newvalue {\*} 相应新值
- oldValue {\*} 相应旧值
- onInvalidate {function} 过期函数调用

watch 原理是 使用响应式变化，而在响应式调度中做相应的调度任务

## watch 实现

### 简单 watch

简单的 watch 实现当 source 值发生变化，执行 cb 函数, 当 source 的 key 属性发生变化时，通过已经建立的相应关系，执行 scheduler 调度任务

```js
function watch(source, cb) {
  effect(() => source.key, {
    scheduler() {
      cb();
    },
  });
}
```

上面的代码有个缺点是，只能相应固定的属性 key，而当 source 的其他属性发生变化时， 不能触发相应。

### source 是对象时处理

为了在 effect 中建立 source 的所有属性的相应，就需要访问其所有的属性， 比如

```js
effect(() => traverse(source), {
  scheduler() {
    cb();
  },
});
```

其中 traverse 是访问 source 的所有属性。其实现原理如下

```js
/**
 * traverse value and it's props
 * @param {object} value value to traverse
 * @param {Set} seen a set to store traversed value
 */
export function traverse(value, seen = new Set()) {
  // 普通类型或者已经访问过的不再访问，防止多次访问
  if (seen.has(value) || isPrimitive(value)) return;

  // 访问过的对象
  seen.add(value);

  // 将其属性和纳入响应式中
  Object.keys(value).forEach(key => {
    traverse(value[key], seen);
  });
}
```

如此，建立了 effect 和 source 对象的响应式关系。

### source 是函数时处理

对于 source 是 function 的情况，其在执行 `effect(() => source(), {scheduler()} {})` 内部的 source() 就已经建立了响应式关系，因此不需要特殊处理。

因此代码如下

```js
export function watch(source, cb) {
  // 非 reactive 和 function 不做处理
  if (!isFunction(source) && !isObject(source)) return;

  // 处理cb
  if (!isFunction(cb)) {
    console.warn('watch callback must be a function');
    cb = () => {};
  }

  let getter;
  if (isFunction(source)) {
    getter = source;
  } else {
    getter = () => traverse(source);
  }
  effect(getter, {
    scheduler() {
      cb();
    },
  });
}
```

## 监听值的变化

对于 `watch(getter, cb(newValue, oldValue, onInvalidate))` 回调函数中 有 newValue 和 oldValue 两个参数，需要进行处理。我们可以如下处理

```js
let oldValue;
let newValue;

// 核心代码
const effectFn = effect(() => getter(), {
  lazy: true,
  scheduler() {
    newValue = cloneDeep(effectFn());

    cb(newValue, oldValue, onInvalidate);
    oldValue = newValue;
  },
});

oldValue = effectFn();
```

## watch 执行时机

### 1. 立即执行

watch 调用时立即执行 cb， 则需要传参 options.immediate = true, 因此代码如下改造

```js
function job() {
  newValue = cloneDeep(effectFn());
  cb(newValue, oldValue, onInvalidate);
  oldValue = newValue;
}

....
....

if(options.immediate) {
  job()
} else  {
  oldValue = effectFn()
}
```

### 2. flush 微任务执行

可以通过 flush 参数设置 回调机制，比如 flush = post 时，延后微任务队列中执行

```js
const effectFn = effect(() => getter(), {
  lazy: true,
  scheduler() {
    // 微任务队列执行
    if (options.flush === 'post') {
      Promise.resolve().then(() => job());
    } else {
      job();
    }
  },
});
```

### 3. 过期策略

watch 需要处理过期策略， 代码如下

```js
// 最终的值
let finalData;

watch(getter, (newValue, oldValue, onInvalidate) => {
  // 是否过期
  let expire = false;

  // 执行过期策略
  // 如果过期策略被执行，则将当前 expire 设置成 true
  // 过期策略在 cb 之前执行
  // 当前 watch 将上次执行的 expire 设置成 true
  onInvalidate(() => {
    expire = true;
  })

  // 异步获取返回值
  let res = await asyncFunc();

  // 没有过期，则返回正确值
  if (!expire) {
    finalData = res;
  }
});
```

具体参考下面代码

## 代码

```js
/**
 * watch source to execute cb function
 * @param {reactive|function} source source to watch
 * @param {function} cb callback function
 */
export function watch(
  source,
  cb,
  options = {
    immediate: false,
    flush: 'sync',
  },
) {
  // 非 reactive 和 function 不做处理
  if (!isFunction(source) && !isObject(source)) return;

  let getter;
  let oldValue;
  let newValue;
  // 过期状态处理
  let expireFn;

  if (!isFunction(cb)) {
    console.warn('watch callback must be a function');
    cb = () => {};
  }

  if (isFunction(source)) {
    getter = source;
  } else {
    getter = () => traverse(source);
  }

  function onInvalidate(fn) {
    expireFn = fn;
  }

  function job() {
    // eslint-disable-next-line no-use-before-define
    newValue = cloneDeep(effectFn());

    // cb 调用之前，调用过期回调
    if (expireFn) {
      expireFn();
    }

    cb(newValue, oldValue, onInvalidate);
    oldValue = newValue;
  }

  // 核心代码
  const effectFn = effect(() => getter(), {
    lazy: true,
    scheduler() {
      // 微任务队列执行
      if (options.flush === 'post') {
        Promise.resolve().then(() => job());
      } else {
        job();
      }
    },
  });

  if (options.immediate) {
    job();
  } else {
    oldValue = cloneDeep(effectFn());
  }
```

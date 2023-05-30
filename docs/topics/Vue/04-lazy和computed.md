---
title: lazy和computed
date: '2023-05-28'
udate: '2023-05-28'
---
# lazy和computed
vue 中 lazy 属性，延迟获取值，比如 
```js
const lazyEffectFn = effect(callback, {lazy: true})
// 主动延迟调用
lazyEffectFn()
```
vue 中 computed 属性，用户获取值， 比如
```js
const computedRes = computed(getter);
// 主动调用 computedRes.value
console.log(computedRes.value)
```

computed 函数使用 lazy 属性，通过计算 lazyEffectFn 可以获取

## lazy属性
我们使用 `const lazyEffectFn = effect(callback, {lazy: true})` 来开启 lazy 属性，在 effect 内部，遇到 lazy 则不再执行 effectFn, 而是直接返回 effectFn。代码如下

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
    let res;

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
  // 调用时执行, lazy执行
  if (options.lazy) {
    return effectFn;
  }
  effectFn();
}
```
## computed计算属性
### 1. effectFn 返回值

computed 的使用方法是 `const computedRes = computed(getter);`。 利用 lazy 属性，同时将 getter 计算结果返回， 在 effectFn 内部，返回 fn 的计算结果。
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
    let res;

    try {
      // 当前 active effectFn
      activeEffectFn = effectFn;
      effectFnStack.push(effectFn);

      // 执行 fn, 在fn内部执行时，会重新建立对象和当前effectFn的依赖关系
      res = fn();
    } finally {
      // 执行结束后操作，更新 activeEffectFn 和 effectFnStack
      effectFnStack.pop();
      activeEffectFn = effectFnStack[effectFnStack.length - 1];
    }

    return res;
  };

  // 存储所有与当前副作用函数相关联的依赖集合
  effectFn.deps = [];
  effectFn.options = options;
  // 调用时执行, lazy执行
  if (options.lazy) {
    return effectFn;
  }
  effectFn();
}

```
### 2. computed 函数
computed 函数内部使用lazy属性，定义一个obj对象，通过 obj.value 获取，建立与当前computed 值的 effect 函数关系，同时在 scheduler 中主动调用 trigger


```js
function computed(getter) {
  // 数据是否是最新数据，表示是否需要重新获取数据标识
  // vue 使用 dirty 字段，表示脏数据，觉得不妥，应为 outdated
  let outdated = true;
  // 缓存当前数据，数据未发生变化时不需要重新计算
  let value;
  const lazyEffectFn = effect(getter, {
    lazy: true,
    scheduler() {
      outdated = true;

      // 在依赖当前计算属性响应式变化时，需要手动 trigger obj 的 value 变化调用
      // 比如在 effect(() => console.log(computedRes.value)), 
      // 此时另一个 effect 依赖计算属性
      // 下面的 trigger 调用原因也是如此
      console.log(`执行调度`);
      trigger(obj, 'value');
    },
  });

  const obj = {
    get value() {
      // 数据不是最新的数据，需要重新计算
      if (outdated) {
        value = lazyEffectFn();
        outdated = false;
      }

      // 手动建立 obj ，value 的追踪方法
      track(obj, 'value');
      return value;
    },
  };

  return obj;
}


```

## 代码
```js
// current active effect
let activeEffectFn;

// effectFnStack, activeEffectFn栈, 使用数组防止递归调用
const effectFnStack = [];

// 存储 target, key, 和 effectFn 关系 bucket
const bucket = new WeakMap();

// 将当前 activeEffectFn 加入到 target 的 key 下的依赖关系中
function track(target, key) {
  if (!activeEffectFn) return;
  // 获取 bucket 中 target 的 map关系
  let depsMap = bucket.get(target);
  if (!depsMap) {
    depsMap = new Map();
    bucket.set(target, depsMap);
  }

  // 获取 key 对应的 effectFn set 对象
  let deps = depsMap.get(key);
  if (!deps) {
    deps = new Set();
    depsMap.set(key, deps);
  }

  // 将当前 activeEffectFn 加入 target, key, 对应的 effectFn set 中
  deps.add(activeEffectFn);

  // 将当前关系加入 activeEffectFn 的 deps 中，以备后续执行副作用函数调用
  activeEffectFn.deps.push(deps);
}

// 执行 target, key 相关的副作用函数
function trigger(target, key) {
  console.log(`执行 key= ${key} 的依赖函数`);
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

  console.log(`key= ${key} 的依赖函数长度 = ${Array.from(effectFns).length}`);

  effectFns.forEach(effectFn => {
    // 如果有调度函数，则执行调度函数
    if (typeof effectFn.options.scheduler === 'function') {
      effectFn.options.scheduler(effectFn);
    } else {
      effectFn();
    }
  });
}

// 清除 effectFn 的所有依赖关系
function cleanup(effectFn) {
  // effectFn.deps 中存储了所有与当前 effectFn 相关联的 target, key 的所有 effectFn deps 列表
  for (const deps of effectFn.deps) {
    deps.delete(effectFn);
  }

  effectFn.deps.length = 0;
}

// reactive 代理对象
function reactive(data) {
  const obj = new Proxy(data, {
    get(target, key, receiver) {
      // 将当前 activeEffectFn 加入 data key 的关系中
      track(target, key);
      return Reflect.get(target, key, receiver);
    },

    set(target, key, newValue, receiver) {
      Reflect.set(target, key, newValue, receiver);

      // 触发执行副作用函数
      trigger(target, key);
      return true;
    },
  });

  return obj;
}

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
    let res;

    try {
      // 当前 active effectFn
      activeEffectFn = effectFn;
      effectFnStack.push(effectFn);

      // 执行 fn, 在fn内部执行时，会重新建立对象和当前effectFn的依赖关系
      res = fn();
    } finally {
      // 执行结束后操作，更新 activeEffectFn 和 effectFnStack
      effectFnStack.pop();
      activeEffectFn = effectFnStack[effectFnStack.length - 1];
    }

    return res;
  };

  // 存储所有与当前副作用函数相关联的依赖集合
  effectFn.deps = [];
  effectFn.options = options;
  // 调用时执行, lazy执行
  if (options.lazy) {
    return effectFn;
  }
  effectFn();
}

function computed(getter) {
  // 数据是否是最新数据，表示是否需要重新获取数据标识
  // vue 使用 dirty 字段，表示脏数据，觉得不妥，应为 outdated
  let outdated = true;
  // 缓存当前数据，数据未发生变化时不需要重新计算
  let value;
  const lazyEffectFn = effect(getter, {
    lazy: true,
    scheduler() {
      outdated = true;

      // 在依赖当前计算属性响应式变化时，需要手动 trigger obj 的 value 变化调用
      // 比如在 effect(() => console.log(computedRes.value)), 此时另一个 effect 依赖计算属性
      // 下面的 trigger 调用原因也是如此
      console.log(`执行调度`);
      trigger(obj, 'value');
    },
  });

  const obj = {
    get value() {
      // 数据不是最新的数据，需要重新计算
      if (outdated) {
        value = lazyEffectFn();
        outdated = false;
      }

      // 手动建立 obj ，value 的追踪方法
      track(obj, 'value');
      return value;
    },
  };

  return obj;
}

```

## 测试用例
```js

const data1 = { name: 'liuzunkun', city: 'xinyang', skill: 'react', age: 31 };
const data2 = { name: 'deshi', city: 'shanghai', gender: 'male', age: 30 };

const obj1 = reactive(data1);
const obj2 = reactive(data2);

function splitlog(text = '') {
  console.log('------------------------------------------');
  console.log(text);
}

splitlog('测试 lazy属性');

const lazyEffectFn1 = effect(
  function effectFn1() {
    console.log(`effectFn1: obj1.name=`, obj1.name, obj1.age);
  },
  {
    lazy: true,
  },
);
console.log(lazyEffectFn1);
lazyEffectFn1();

splitlog('测试 computed 属性');

const computedRes = computed(() => obj1.age + obj2.age);

console.log(computedRes);

console.log(computedRes.value);

splitlog('测试 computed 属性的依赖');

effect(() => {
  console.log(`所有年龄是: `, computedRes.value);
});

splitlog('测试 computed 属性的依赖变化');
obj1.age = 33;

```

执行结果
```shell
------------------------------------------
测试 lazy属性
[Function: effectFn] { deps: [], options: { lazy: true } }
effectFn1: obj1.name= liuzunkun 31
------------------------------------------
测试 computed 属性
{ value: [Getter] }
61
------------------------------------------
测试 computed 属性的依赖
所有年龄是:  61
------------------------------------------
测试 computed 属性的依赖变化
执行 key= age 的依赖函数
key= age 的依赖函数长度 = 2
effectFn1: obj1.name= liuzunkun 33
执行调度
执行 key= value 的依赖函数
key= value 的依赖函数长度 = 1
所有年龄是:  63
```

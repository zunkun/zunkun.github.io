---
title: effect响应式1
date: '2023-05-28'
udate: '2023-05-28'
---
# effect响应式1
简单说，响应式就是建立数据 `data` 和 副作用 `effect(callback)` 之间的关系，`data` 的变化，相应会调用 `effect`。因此需要两个步骤

1. 监听 data 变化， 使用 Proxy 和 Reflect 代理对象获取和设置
2. 建立 data 和 effect 的关系

## 对象代理


vue3 中使用 Proxy 代理 data, 对其获取(getter)和设置(setter)进行拦截，返回一个对象 obj，如下所示
```js
const data = {name: 'liuzunkun', skill: 'vue, react', printAll: true};
const obj = reactive(data)
```
这样使用 `obj.name` 和 `obj.name = 'deshi'` 进行操作 `data`

其中 方法`reactive` 可以如下使用
```js
// ref 代理对象
function reactive(data) {
  const obj = new Proxy(data, {
    get(target, key, receiver) {
      return Reflect.get(target, key, receiver);
    },

    set(target, key, newValue, receiver) {
      Reflect.set(target, key, newValue, receiver);

      return true;
    },
  });

  return obj;
}

```

## 副作用函数effect

### 1. target 通过 key 和 effectFn 关系
假设如下代码, 我们需要建立 effect 中使用了 obj1, obj2 , printAll，因此需要建立与其关系， obj1, obj2, 和 printALl 值发生变化，需要再次执行副作用函数
```js
const printAll = reactive(true);
const obj1 = reactive({name: 'liuzunkun'});
const obj2 = reactive({name: 'deshi'});
effect(() => {
  console.log(printAll ? obj1.name + obj2.name, obj1.name);
})
```
观察上面的代码， effect 执行结果中 obj2 与 effect 关系收到 printAll 的影响，当 printAll = false 时，无论此时 obj2 如何变化，当前副作用函数都不再需要执行，需要销毁 obj2 与 effect 的关系。

另一方面，假设在 effect 中有如下代码, 如果 修改了 obj.name2, 则 effectFn2 重新执行，而 effectFn 则不需要重新执行
```js

effect(function effectFn1(){
  console.log(obj1.name)
})

effect(function effectFn2(){
  console.log(obj1.name2)
})
```
因此需要建立 target, key 和 effectFn 的映射

<pre class="mermaid">
flowchart TB
  subgraph target1关系
    target1 --> key1 & key2 & key3
  end
    key1 --> effectFn1 & effectFn2
    key2 --> effectFn1
    key3 --> effectFn2 & effectFn3

  subgraph effectFn
    effectFn1
    effectFn2
    effectFn3
  end

  subgraph target2关系
    target2 --> target2key1
  end
  target2key1 --> effectFn1
</pre>

代码如下
```js
// 副作用函数
function effect(fn) {
  const effectFn = () => {
    // 清除所有与当前effectFn的关联关系, 防止
    // 1. effectFn重新执行时，旧的依赖关系已经变化， 比如 effectFn 和 obj1.key1, obj2.key2 建立关系，当前可能和ojb2.key2 不再有关系，所以需要清除
    // 2. 当前依赖关系可能已经不存在了，清除该关系, 比如 effectFn 和 obj1.key1 有关系，此时可能关系不在
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
  // 调用时执行
  effectFn();
}

```

### 2. 建立关系和响应
在 `effect(effectFn)` 这个关系中， effectFn 中获取 taget 的 key 属性，则需要建立 effectFn, target, key 之间的关系，需要重写 `reactive` 方法中的 `getter`

当设置 key 属性的时候，需要获取 key 相关的的副作用方法列表，执行

#### reactive方法

``` js
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

```
#### track方法
其中 track 方法建立关系， 代码如下
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

```

#### trigger 方法
```js
// 执行 target, key 相关的副作用函数
function trigger(target, key) {
  // 获取 bucket 中 target 的 map关系
  let depsMap = bucket.get(target);
  if (!depsMap) return;

  let effects = depsMap.get(key);
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

  effectFns.forEach(effectFn => effectFn());
}

```

### 3. 清除关系
副作用方法 `effect(callback)`，需要再 effect 内部先清除与当前 effectFn 相关的关系，然后在 callback 内部 建立 target 的 key 与 effectFn 的关系，上面建立关系方法已经说明，现在说明 cleanup 方法

```js
// 清除 effectFn 的所有依赖关系
function cleanup(effectFn) {
  // effectFn.deps 中存储了所有与当前 effectFn 相关联的 target, key 的所有 effectFn deps 列表
  for (const deps of effectFn.deps) {
    deps.delete(effectFn);
  }

  effectFn.deps.length = 0;
}

```

### 4. 注意事项
trgger 方法中需要防止栈溢出和无限循环调用

1. 为防止 effectFnStack 溢出，使用 effectFns 代替 effects,比如 
```js
effects.forEach(effectFn => effectFn()),
```
此时 effectFn执行会执行cleanup, 而在 effectFn 内部又执行了 trigger，建立关系，这没问题，但是此时 effects 还在执行中，这个循环就不会结束，因此借用 effectFns 复制内部数据

2. 为防止 effectFn 中 trigger 的 effectFn 与当前 activeEffectFn 相同，无限递归。比如 
```js
effect(() => obj.num +=1)
```

代码如下

```js
const effectFns = new Set(effects);
const effectFns = [];
for (const effectFn of [...effects]) {
  if (effectFn !== activeEffectFn) {
    effectFns.push(effectFn);
  }
}
```

## 代码如下
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
  // 获取 bucket 中 target 的 map关系
  let depsMap = bucket.get(target);
  if (!depsMap) return;

  let effects = depsMap.get(key);
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
  effectFns.forEach(effectFn => effectFn());
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
function effect(fn) {
  const effectFn = () => {
    // 清除所有与当前effectFn的关联关系, 防止
    // 1. effectFn重新执行时，旧的依赖关系已经变化， 比如 effectFn 和 obj1.key1, obj2.key2 建立关系，当前可能和ojb2.key2 不再有关系，所以需要清除
    // 2. 当前依赖关系可能已经不存在了，清除该关系, 比如 effectFn 和 obj1.key1 有关系，此时可能关系不在
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
  // 调用时执行
  effectFn();
}
```

## 测试
### 1. 简单测试
```js
const data1 = { name: 'liuzunkun', city: 'xinyang', skill: 'react' };
const data2 = { name: 'deshi', city: 'shanghai', gender: 'male', age: 30 };

const obj1 = reactive(data1);
const obj2 = reactive(data2);

effect(function effectFn1() {
  console.log(`effectFn1: obj1.name=`, obj1.name);
});

effect(function effectFn2() {
  console.log(`effectFn2: obj1.name=`, obj1.name);
  console.log(`effectFn2: obj2.name=`, obj2.name);
});

effect(function effectFn3() {
  console.log(`effectFn3: obj1.city=`, obj1.city);
});

function splitlog(text = '') {
  console.log('------------------------------------------');
  console.log(text);
}

splitlog('测试设置: obj1.name = zunkun.liu');
obj1.name = 'zunkun liu';

splitlog('测试设置: obj2.name = deshi.liu');
obj2.name = 'deshi.liu';

splitlog('测试设置: obj1.city = shanghai');
obj1.city = 'shanghai';

splitlog('测试设置: obj1.city2 = shanghai');
obj1.city2 = 'shanghai';

splitlog('测试嵌套 effect');

effect(function effectFn4() {
  console.log(`effectFn4: obj2.gender=`, obj2.gender);
  effect(function effectFn5() {
    console.log(`effectFn5: obj1.gender=`, obj1.gender);
    console.log(`effectFn5: obj2.gender=`, obj2.gender);
  });
});

splitlog('测试设置obj2.gender=M');
obj2.gender = 'M';

splitlog('测试effect中循环设置');
effect(function effectFn6() {
  console.log(`effectFn6, obj2.age=`, obj2.age);
  // obj2.age += 1;
  obj2.age = obj2.age + 1;
});

```
执行结果

```shell
effectFn1: obj1.name= liuzunkun
effectFn2: obj1.name= liuzunkun
effectFn2: obj2.name= deshi
effectFn3: obj1.city= xinyang
------------------------------------------
测试设置: obj1.name = zunkun.liu
effectFn1: obj1.name= zunkun liu
effectFn2: obj1.name= zunkun liu
effectFn2: obj2.name= deshi
------------------------------------------
测试设置: obj2.name = deshi.liu
effectFn2: obj1.name= zunkun liu
effectFn2: obj2.name= deshi.liu
------------------------------------------
测试设置: obj1.city = shanghai
effectFn3: obj1.city= shanghai
------------------------------------------
测试设置: obj1.city2 = shanghai
------------------------------------------
测试嵌套 effect
effectFn4: obj2.gender= male
effectFn5: obj1.gender= undefined
effectFn5: obj2.gender= male
------------------------------------------
测试设置obj2.gender=M
effectFn4: obj2.gender= M
effectFn5: obj1.gender= undefined
effectFn5: obj2.gender= M
effectFn5: obj1.gender= undefined
effectFn5: obj2.gender= M
------------------------------------------
测试effect中循环设置
effectFn6, obj2.age= 30

```
### 2. 循环嵌套设置bug
::: danger bug说明
循环嵌套读取设置，现在还有bug，需要优化解决
:::

```js
splitlog('测试嵌套effect中循环设置， 测试失败');

effect(function effectFn7() {
  console.log(`effectFn7, obj2.age=`, obj2.age);
  effect(function effectFn8() {
    console.log(`effectFn8, obj2.age=`, obj2.age);
    // obj2.age += 1;
    obj2.age = 'dd';
  });
});

```
上面的测试会导致 `effectStackFn` 栈溢出，原因是在 effectFn8 中执行了 读取和设置 obj2.age, 这个并不是问题，问题出在上层 effectFn7 也同样读取 obj2.age, 建立了依赖关系， 而 effectFn7 的执行又会执行下层 effectFn8, 如此循环往复，造成栈溢出，需要防范上面的写法。

然而，可以修改上面的代码, 将 上层 effectFn7 读取 obj2.age 放在 effectFn8 后面，则依赖关系解除。
```js
splitlog('测试嵌套effect中循环设置， 测试失败');

effect(function effectFn7() {
  effect(function effectFn8() {
    console.log(`effectFn8, obj2.age=`, obj2.age);
    // obj2.age += 1;
    obj2.age = 'dd';
  });
  console.log(`effectFn7, obj2.age=`, obj2.age);
});

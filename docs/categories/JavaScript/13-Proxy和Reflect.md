---
title: Proxy和Reflect
date: '2023-02-25'
udate: '2023-02-25'
---

# Proxy和Reflect
在 JS 中 Proxy 和 Reflect 通常是一起出现。

Proxy 对象用于创建一个对象的代理，从而实现基本操作的拦截和自定义（如属性查找、赋值、枚举、函数调用等）。

学习 Vue3 过程中，vue3 中的 ref 和 reactive 代理变量（对象或普通变量），重新定义了对于对象的获取和操作。其实现响应式，依赖的就是 Proxy 和 Reflect

```js
const proxy = new Proxy(target, handler)
```
target: 被代理的对象
handler: 定义对象的访问和操作，比如 get， set， 等操作,称作捕获器(trap)

## target, receiver 指向谁
get 用于拦截 获取操作， set 用户拦截设置操作

```js
const proxy = new Proxy(target, {
  get(target, key, receiver) {
    // 此处拦截属性获取，必须是被代理对象有的key才能获取
    if(key in target) {
      return Reflect.get(target, key, receiver);
    }
    return undefined;
  },
  set(target, key, value, receiver) {
    // 此处拦截必须是对象的属性才能够设置
    if(key in target) {
      Reflect.set(target, key, value, receiver)
      return true;
    }

    return false;
  }
})

```
上面的代码中出现了第三个参数 receiver ， MDN 的解释是 `Either the proxy or an object that inherits from the proxy.`, 要么是 proxy ，要么是 继承 proxy 的对象。

下面的代码中 `target === parent, proxy === receiver`

```js
const parent = {
	name: 'parent name',
	get value() {
		return this.name;
	},
};

const proxy = new Proxy(parent, {
	get(target, key, receiver) {
		console.log(target === receiver); // false
		console.log(target === parent); // true
		console.log(proxy === receiver); // true
		console.log(this === receiver); // false

		return target[key];
	},
});

console.log(proxy.name); // parent name

```
至此， 第三个参数 receiver 还没有使用，receiver 指向 当前调用的上下文, this 指向 handler

稍微改一下
```js
const parent = {
	name: 'parent',
	get value() {
		return this.name;
	},
};

const proxy = new Proxy(parent, {
	get(target, key, receiver) {
		console.log(target === receiver); // false
		console.log(target === parent); // true
		console.log(proxy === receiver); // false
		console.log(obj === receiver); // true

		return target[key];
	},
});

const obj = { name: 'obj' };

Object.setPrototypeOf(obj, proxy);

console.log(obj.name); // obj
console.log(obj.value); // parent

```
obj 继承 proxy， 可以看到此时 receiver = obj

由此可知 **receiver 指向 proxy对象或者其继承proxy的对象**

Reflect 和 Proxy 提供了相同的方法

## 为什么要用Reflect.get获取数据
还是上面的代码, 稍作修改

``` js
const proxy = new Proxy(parent, {
	get(target, key, receiver) {
		// return target[key];
		return Reflect.get(target, key, receiver);
	},
});

const obj = { name: 'obj' };

Object.setPrototypeOf(obj, proxy);

console.log(obj.name); // obj
console.log(obj.value); // obj
```

可以看到 obj.value 是我们想要的值, `Reflect.get(target, key, receiver)` 中的 receiver 改变了 this 指向。

诡异的是下面的代码的值
```js
Reflect.get({ name: 'parent' }, 'name', { name: 'son' }) // parent
```
为何不是 son 呢， 难道 {name: 'son'} 没有改变 this 指向吗？

其实不然，下面的代码 正好是正确的，这是为何那 ？

```js
// son
Reflect.get(
  {
    name: 'parent',
    get value() {
      return this.name;
    },
  },
  'value',
  { name: 'son' }
)

```
查找 MDN 可以发现

:::tip
receiver: 如果target对象中指定了getter，receiver则为getter调用时的this值。
:::

也就是说，如果 target 中指定了 getter , receiver 才能在调用時有效，否则无效。

现在清晰了， value 提供了 getter 方法，才能在调用時, receiver 改变了 this 指向。


## 参考

1. [Proxy - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy)
2. [Proxy | JAVASCRIPT.INFO](https://zh.javascript.info/proxy)
1. [Reflect - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect)


---
title: Proxy代理对象
date: '2023-02-25'
udate: '2023-02-25'
---

# Proxy代理对象

参考MDN: 

[Proxy - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy)

**Proxy**
 对象用于创建一个对象的代理，从而实现基本操作的拦截和自定义（如属性查找、赋值、枚举、函数调用等）。

## [语法](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy#%E8%AF%AD%E6%B3%95)

`const p = new Proxy(target, handler)`

### [参数](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy#%E5%8F%82%E6%95%B0)

`target`要使用 `Proxy` 包装的目标对象（可以是任何类型的对象，包括原生数组，函数，甚至另一个代理）。`handler`一个通常以函数作为属性的对象，各属性中的函数分别定义了在执行各种操作时代理 `p` 的行为。

## [方法](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy#%E6%96%B9%E6%B3%95)

`Proxy.revocable()`创建一个可撤销的`Proxy`对象。

## [handler 对象的方法](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy#handler_%E5%AF%B9%E8%B1%A1%E7%9A%84%E6%96%B9%E6%B3%95)

`handler` 对象是一个容纳一批特定属性的占位符对象。它包含有 `Proxy` 的各个捕获器（trap）。

所有的捕捉器是可选的。如果没有定义某个捕捉器，那么就会保留源对象的默认行为。

`[handler.getPrototypeOf()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy/Proxy/getPrototypeOf)Object.getPrototypeOf` 方法的捕捉器。`[handler.setPrototypeOf()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy/Proxy/setPrototypeOf)[Object.setPrototypeOf](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/setPrototypeOf)` 方法的捕捉器。`[handler.isExtensible()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy/Proxy/isExtensible)[Object.isExtensible](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/isExtensible)` 方法的捕捉器。`[handler.preventExtensions()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy/Proxy/preventExtensions)[Object.preventExtensions](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/preventExtensions)` 方法的捕捉器。`[handler.getOwnPropertyDescriptor()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy/Proxy/getOwnPropertyDescriptor)[Object.getOwnPropertyDescriptor](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptor)` 方法的捕捉器。`[handler.defineProperty()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy/Proxy/defineProperty)[Object.defineProperty](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)` 方法的捕捉器。`[handler.has()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy/Proxy/has)[in](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/in)` 操作符的捕捉器。`[handler.get()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy/Proxy/get)`属性读取操作的捕捉器。`[handler.set()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy/Proxy/set)`属性设置操作的捕捉器。`[handler.deleteProperty()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy/Proxy/deleteProperty)[delete](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/delete)` 操作符的捕捉器。`[handler.ownKeys()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy/Proxy/ownKeys)[Object.getOwnPropertyNames](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyNames)` 方法和 `[Object.getOwnPropertySymbols](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertySymbols)` 方法的捕捉器。`[handler.apply()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy/Proxy/apply)`函数调用操作的捕捉器。`[handler.construct()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy/Proxy/construct)[new](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/new)` 操作符的捕捉器。

一些不标准的捕捉器已经被[废弃并且移除](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Deprecated_and_obsolete_features#proxy)了。

### [基础示例](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy#%E5%9F%BA%E7%A1%80%E7%A4%BA%E4%BE%8B)

在以下简单的例子中，当对象中不存在属性名时，默认返回值为 `37`。下面的代码以此展示了 `[get](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy/Proxy/get)` handler 的使用场景。

```jsx
const handler = {
    get: function(obj, prop) {
        return prop in obj ? obj[prop] : 37;
    }
};

const p = new Proxy({}, handler);
p.a = 1;
p.b = undefined;

console.log(p.a, p.b);      // 1, undefined
console.log('c' in p, p.c); // false, 37

```

### [无操作转发代理](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy#%E6%97%A0%E6%93%8D%E4%BD%9C%E8%BD%AC%E5%8F%91%E4%BB%A3%E7%90%86)

在以下例子中，我们使用了一个原生 JavaScript 对象，代理会将所有应用到它的操作转发到这个对象上。

```jsx
let target = {};
let p = new Proxy(target, {});

p.a = 37;   // 操作转发到目标

console.log(target.a);    // 37. 操作已经被正确地转发
```

### [验证](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy#%E9%AA%8C%E8%AF%81)

通过代理，你可以轻松地验证向一个对象的传值。下面的代码借此展示了 `[set](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy/Proxy/set)` handler 的作用。

```jsx
let validator = {
  set: function(obj, prop, value) {
    if (prop === 'age') {
      if (!Number.isInteger(value)) {
        throw new TypeError('The age is not an integer');
      }
      if (value > 200) {
        throw new RangeError('The age seems invalid');
      }
    }

    // The default behavior to store the value
    obj[prop] = value;

    // 表示成功
    return true;
  }
};

let person = new Proxy({}, validator);

person.age = 100;

console.log(person.age);
// 100

person.age = 'young';
// 抛出异常: Uncaught TypeError: The age is not an integer

person.age = 300;
// 抛出异常: Uncaught RangeError: The age seems invalid
```

---
title: this指向
date: '2023-03-30'
udate: '2023-03-30'
---
# this指向
在 JS 中，this 指向是一个令人迷惑的问题，处理不好 this， JS运行结果可能并非想要的结果。

this 的值，在非严格模式下，总是指向一个对象，在严格模式下，可以是任意值，包括 undefined。
比如，下面在严格模式下，浏览器中运行结果, 严格模式下， 外层 this = undefined, 非严格模式下 this 指向 window

```js
'use strict'
const test = {
  prop: 42,
  func: function() {
    return this.prop;
  },
};
console.log(this) // undefined
console.log(test.func()); // 42

```

## 全局上下文中 this 指向
```js
global.a = 4; // 全局对象

this.a = 6; 
window.b = 5; // 浏览器中
```

全局对象 this 指向 可以参考 `globalThis`， 浏览器中是 `window`， nodejs 中是 `global`, 全局通用

注意在 nodejs 模块中， this 指向模块，而不是 global, 需要区分开来


## 对象中的 this 指向
对象中方法 this 指向其上层闭合对象

下面 b 方法 和 d 方法 中 this.a 不同

```js
global.a = 4; // 全局对象

this.a = 5; // 当前模块 this 

const obj = {
  // obj对象自身属性 a
  a: 1,
  b() {
    console.log(this.a); 
    console.log(global.a);
  },
  c: {
    a: 3,
    d() {
      console.log(this.a); 
    },
  },
  e: () => {
    console.log(this.a);
  },
};

```
可以看到 obj 自身，模块本身，全局对象都有属性 `a`, 不同调用方式，a 的值不同

1. 对象自身属性

```js
console.log(obj.a) // 1
```

2. 非严格模式下，obj 内部方法中 this 指向 其闭合对象外部上下文， 严格模式下 this = undefined

```js

obj.b() // 此时 this.a === 1, this 指向 obj 自身

obj.c.d() // 此时  this.a = 3， this 指向方法 d 的闭合此法上下文 c 

```

## 函数体 this 指向

### 1. 普通函数调用
普通函数内部 this 指向，取决于函数调用方式。函数直接调用 this 指向全局对象，而 call, bind 可以改变this 指向

```js
const obj = { a: 2 };

global.a = 1;

function print() {
  const a = 2;

  console.log(this.a);

  function subprint() {
    console.log(this.a);
  }

  subprint();
}

print();

print.call(obj); // 1
print.apply(obj, []); // 2

```

1. 本例子中，调用普通函数 `print`, 内部 `this.a` 和 `subprint` 中 `this.a` 都是 1， 都指向全局 `this`

2. 关键字 `call`  , `apply` 改变了函数内部 `this` 指向

### 2. 箭头函数
箭头函数，没有自身的 this.在箭头函数中，this与封闭词法环境的this保持一致。在全局代码中，它将被设置为全局对象：
```js

var globalObject = this;
var foo = (() => this);
console.log(foo() === globalObject); // true
```

### 3. call 和 apply, bind 改变 this 指向
call 和 apply 可以改变 this 指向，区别在于参数不同。

```js
print.call(obj); 
// 3
// 1
```

可以看到，call 改变了 print 内部的 this指向，但是却没有 改变内部函数 subprint 的 this 指向




## 参考
1. JavaScript 设计模式以与开发实践
2. [This | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/this)

## 类构造函数中 this
JS 中 类是语法糖，构造函数要么需要显式返回一个对象obj 作为 this，要么什么都不返回，this指向调用的对象

1. 不返回对象， 此时 this 指向调用的对象

``` js

const MyFunc = function (name) {
  this.name = name;
};

MyFunc.prototype.print = function () {
  console.log(this.name);
};

const func1 = new MyFunc('zunkun');
func1.print(); // zunkun

const func2 = new MyFunc('liu');
func2.print(); // liu

```

2. 显式返回对象， 此时注意，返回了新对象，原函数的构造函数不可再用
``` js
const MyFunc = function (name) {
  this.name = name;
  return {
    name: 'myfunc name',
  };
};

MyFunc.prototype.print = function () {
  console.log(this.name);
};

const func1 = new MyFunc('zunkun');
func1.print(); // zunkun

const func2 = new MyFunc('liu');
func2.print(); // liu
```

上面的 MyFunc 返回了一个新的对象，因此 print 方法不再可用。

改造，绑定 this

```js
const MyFunc = function (name) {
  this.name = name;
  return {
    name: 'myfunc name',
    print: this.print.bind(this),
  };
};

```



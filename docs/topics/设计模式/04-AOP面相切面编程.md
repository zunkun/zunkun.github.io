---
title: AOP面相切面编程
date: '2023-08-31'
udate: '2023-08-31'
---

# AOP 面相切面编程

AOP(Aspect-Oriented Programming) 面相切面编程。同过将核心的业务封装，将其他任务比如权限校验，日志等操作提起出来，在方法执行前注入，可以使代码清晰，好维护。举个例子

假设 `add, minus` 方法中先执行权限校验，然后执行核心业务代码，最后要执行日志记录操作。可以经 `authValidate 和 logHandle` 提取出来，分别在核心代码执行之前和之后注入，代码结构就清晰了。

```js
var obj = {
  add(a, b) {
    // 权限校验
    authValidate();
    // 核心业务
    let ret = a + b;
    // 打印日志
    logHandle();
    return ret;
  },
  minus(a, b) {
    // 权限校验
    authValidate();
    // 核心业务
    let ret = a - b;
    // 打印日志
    logHandle();
    return ret;
  },
};
```

注入之后，如

```js
newObj.validateAuth().add().logHandle();
```

## 函数全体注入

下面的方法会在全体函数中注入 3 中方法， `before, after, around`。

```js
Function.prototype.before = function (beforeFn) {
  var self = this;

  return function () {
    beforeFn.apply(this, arguments);

    return self.apply(this, arguments);
  };
};

Function.prototype.after = function (afterFn) {
  var self = this;

  return function () {
    var ret = self.apply(this, arguments);

    afterFn.apply(this, arguments);
    return ret;
  };
};

Function.prototype.around = function (beforeFn, afterFn) {
  var self = this;

  return function () {
    return self.before(beforeFn).after(afterFn).apply(this, arguments);
  };
};

var log = function (info) {
  console.log(`LOG: `, info);
};

var newFn = log.before(function () {
  console.log('newFn1 before called');
  return 1;
});

newFn(11);

var newFn2 = log.after(function () {
  console.log('newFn2 after called');
  return 1;
});

newFn2(22);
var newFn3 = log.around(
  function () {
    console.log('newFn3 before called');
  },
  function () {
    console.log('newFn3 after called');
  },
);

newFn3(33);
```

## 具体对象注入方法

下面的实现方式可以注入具体某个对象的具体方法上。

```js
/**
 * 获取对象自身的方法
 */
const getMethods = obj =>
  Object.getOwnPropertyNames(obj).filter(item => typeof obj[item] === 'function');

/**
 * 获取对象原型中的方法
 */
// const getMethods = (obj) =>
// 	Object.getOwnPropertyNames(Object.getPrototypeOf(obj)).filter(
// 		(item) => typeof obj[item] === 'function'
// 	);

/**
 * 封装对象原有执行方法，根据不同规则注入
 */
function replaceMethod(target, methodName, aspect, advice) {
  let originalCode = target[methodName];

  target[methodName] = (...args) => {
    if (['before', 'around'].includes(advice)) {
      aspect.apply(target, args);
    }

    const returnValue = originalCode.apply(target, args);

    if (['after', 'around'].includes(advice)) {
      aspect.apply(target, args);
    }

    if (advice === 'afterReturning') {
      return aspect.apply(target, [returnValue]);
    } else {
      return returnValue;
    }
  };
}

/**
 * APO
 */
const AOP = {
  inject: function (target, aspect, advice, pointcut, method) {
    if (pointcut === 'method') {
      if (method) {
        return replaceMethod(target, method, aspect, advice);
      }
    }

    if (pointcut === 'methods') {
      let methods = getMethods(target);
      methods.forEach(m => replaceMethod(target, m, aspect, advice));
    }
  },
};

/**
 * 在方法之前注入的方法
 */
function injectBefore() {
  console.log('calling before');
}

function injectReturn(val) {
  console.log('calling return', val);
}

var obj = {
  add(a, b) {
    return a + b;
  },

  minus(a, b) {
    return a - b;
  },
  print(a, b) {
    console.log({ a, b });
  },
};

AOP.inject(obj, injectBefore, 'before', 'methods');
AOP.inject(obj, injectReturn, 'afterReturning', 'method', 'add');

obj.add(1, 2);
obj.minus(5, 4);

obj.print(7, 8);
```

## 参考

1. JavaScript 设计模式与开发时间
2. [Aspect-Oriented Programming in JavaScript](https://blog.bitsrc.io/aspect-oriented-programming-in-javascript-c4cb43f6bfcc)

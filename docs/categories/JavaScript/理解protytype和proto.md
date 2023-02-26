---
title: 理解protytype和proto
---

# 理解protytype和proto

先上图
![图1](/protovsprototype.jpg)
另一张

![图3](/protoaa.png)


## 总结：

1.所有对象都有__proto__属性。

2.只有函数对象才有prototype属性。

3.protoype对象默认有两个属性：constructor 和 proto。

4.实例对象的__proto__指向的是函数的protoype

5.函数对象的prototype属性是外部共享的，而__proto__是隐式的。

6.函数和Object的__proto__的顶端是null

## 示例

### 示例1

![图2](/proto2.png)


```js
var obj = { a : 1 };
console.log(obj.__proto__ === Object.prototype);    // true


var str = new String('123');
console.log(str.__proto__ === String.prototype);    // true


function Point(){};
var Circle = Object.create(Point);
console.log(Circle.__proto__ === Point);            // true
console.log(Circle.__proto__ === Point.prototype);  // false


var p = new Point();
console.log(Point.__proto__);   // function Empty() {}
console.log(Point.prototype);   // Point {}
console.log(p.__proto__);       // Point {}
console.log(p.prototype);       // undefined
```

### 示例2

Object.create(proto，[propertiesObject])

```js
const person = {
  isHuman: false,
  printIntroduction: function() {
    console.log(`My name is ${this.name}. Am I human? ${this.isHuman}`);
  }
};

const me = Object.create(person);

me.name = 'Matthew'; // "name" is a property set on "me", but not on "person"
me.isHuman = true; // inherited properties can be overwritten

me.printIntroduction();
// expected output: "My name is Matthew. Am I human? true"
```
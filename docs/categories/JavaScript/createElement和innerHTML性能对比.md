---
title: createElement和innerHTML性能对比
date: '2023-02-26'
udate: '2023-02-26'
---

# createElement和innerHTML性能对比

本文转载cnblobs文档


innerHTML性能比较低

## 前言

在DOM节点操作中，innerHTML和createElement都可以实现创建元素。它们实现的功能类似，但是效率却相差很大。本文分别统计用innerHTML字符串拼接方式、innerHTML数组方式和createElement方式创建1000次元素的时间，来比较它们之间效率的高低。

## 比较思路

1. 使用new调用创建日期对象
2. 完成1000次创建相同元素后的时间，减去创建之前的时间，即为过程所用的时间（单位：ms）
3. 比较三种方式所用的时间

## 比较过程

### 1. innerHTML字符串拼接方式

代码

```jsx
function fn() {
    var d1 = +new Date();
    var str = '';
    for (var i = 0; i < 1000; i++) {
        document.body.innerHTML += '<div style="width:100px; height:2px; border:1px solid blue;"></div>';
    }
    var d2 = +new Date();
    console.log(d2 - d1);
}
fn();
```


### 2. innerHTML数组方式

代码

```jsx
function fn() {
    var d1 = +new Date();
    var array = [];
    for (var i = 0; i < 1000; i++) {
        array.push('<div style="width:100px; height:2px; border:1px solid blue;"></div>');
    }
    document.body.innerHTML = array.join('');
    var d2 = +new Date();
    console.log(d2 - d1);
}
fn();
```




### 3. createElement方式

代码：

```jsx
function fn() {
    var d1 = +new Date();
    for (var i = 0; i < 1000; i++) {
        var div = document.createElement('div');
        div.style.width = '100px';
        div.style.height = '2px';
        div.style.border = '1px solid red';
        document.body.appendChild(div);
    }
    var d2 = +new Date();
    console.log(d2 - d1);
}
fn();
```


## 总结：

1. 显然，三种方式所用的时间：`innerHTML字符串拼接方式 >> createElement方式 > innerHTML数组方式`
2. 则三种方式的效率高低：`innerHTML数组方式 > createElement方式 > innerHTML字符串拼接方式`
3. 可以根据实际情况需要，选择合适的方式

说明：这种对比方式有问题，其实innerHTML是拼接字符串，然后渲染。

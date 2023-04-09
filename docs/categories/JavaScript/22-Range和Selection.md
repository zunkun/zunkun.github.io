---
title: Range 和 Selection
date: '2023-04-09'
udate: '2023-04-09'
---
# Range 和 Selection
如果在富文本中，需要按照光标位置，将富文本内容拆分成两个富文本，该如何处理？

这需要用到 selection 确定光标位置， 用 range 获取光标到富文本末尾内容的选择

## Range 用法
```js
const range = new Range()
```
这是创建range对象的方法。

假设有下面的代码

```html
<p>Example: <i>tag i content</i> and <b>tag b content</b></p>
```

在 p 标签内, offset 表示偏移量
1. `Example:` 的 offset =  0
2. `<i>tag i content</i>` offset=1
3. `and`, offset=2
4. `<b>tag b content</b>`, offset=3

我们可以如下执行



``` html
<p>Example: <i>tag i content</i> and <b>tag b content</b></p>
<script>
  const p = document.querySelector('p')
  const range = new Range();
  range.setStart(p, 0);

  range.setEnd(p, 1);

  alert(range)

</script>
```
我们发现弹窗内容为 `Example: `, 这里为 range 对象设置了开始结束位置。

设置范围的起点

* setStart(node, offset) 将起点设置在：node 中的位置 offset
* setStartBefore(node) 将起点设置在：node 前面
* setStartAfter(node) 将起点设置在：node 后面

设置范围的终点
* setEnd(node, offset) 将终点设置为：node 中的位置 offset
* setEndBefore(node) 将终点设置为：node 前面
* setEndAfter(node) 将终点设置为：node 后面

假设需要分割位置初始位置知道了，那么我们使用  setEndAfter 在富文本后面作为结束位置，那么 range不就只想了从光标到富文本结束的的位置了吗，然后便可以获取内容。

## Selection
```js
const { anchorNode, anchorOffset, focusNode, focusOffset }  = document.getSelection();
```

* anchorNode 开始节点 , anchorOffset 选择开始的offset
* focusNode 选择结束节点， focusOffset  选择结束节点内的offset

## 代码

因此上面的需求可以如下写

```js
// 获取富文本节点
const richContainer = document.querySelector('#richtext');

const {anchroNode, anchorOffset} = document.getSlection();

const range = new Range();
// 设置开始结束节点
range.setStart(anchorNode, anchorOffset);
range.setEndAfter(richContainer);

// 复制范围中的内容，并将复制的内容作为 DocumentFragment 返回
const content = range.cloneContents();
const divNode = document.createElement('div')
divNode.innerHTML = content;
// 处理divNode， 此处省略

// 删除范围内容
range.deleteContents()
```


## 参考
1. [Range | MDN](https://developer.mozilla.org/en-US/docs/Web/API/range)
2. [Selection  | MDN](https://developer.mozilla.org/en-US/docs/Web/API/selection)
3. [Range和Selection-富文本基石 | 掘金](https://juejin.cn/post/7218419207130497082)
4. [选择（Selection）和范围（Range）| JAVASCRIPT.INFO](https://zh.javascript.info/selection-range)

---
title: CSS选择器
date: '2023-03-20'
udate: '2023-03-20'
---
# CSS选择器

## 1. 元素选择符

比如  p, div, a, img 等html元素标签选择

## 2. 属性选择符

元素中包含某种属性，根据属性选择匹配

* [foo|="bar"] 表示元素有foo属性，并且其值以bar或者bar-开头
* [foo~="bar"] 表示元素有foo属性，并且其值包含bar这一组词语
* [foo^="bar"]表示foo属性的值以bar开头
* [foo$="bar"]表示foo属性的值以bar结尾
* [foo*="bar"]表示foo属性的值包含bar子串

例如 a[href$=’PDF’ i] 表示a标签中有href属性，且值以pdf结尾，其中i表示不区分大小写

## 3. id和class选择器

这个没什么可说的

## 4. 子类兄弟选择

* foo, bar 表示选择foo 和bar元素都可以
* foo bar 表示选择bar， 且bar是foo的后代，不区分层级
* foo > bar 表示选择bar，且bar是foo的第一级子元素
* foo + bar 表示选择bar，且bar是foo的后面相邻的兄弟元素， foo， bar 拥有同一父级
* foo ~ bar 表示选择bar， 且bar是foo的同胞，且bar未必就是foo的相邻元素，bar和foo拥有同一父元素

## 5. 伪类选择

### foo:bar 表示选择foo元素且foo元素满足bar条件的选择器

例如  .tom:first-child 表示选择.tom类，并且是选择第一个.tom的元素， 这里需要注意，不是.tom

的子元素

下面的用法是正确的

```css
a:link:hover {color: red}
a:visited:hover {color: blue}
```

1. 唯一后代选择
    
    foo:only-child 表示选择foo树形，并且foo是父元素的唯一子元素
    
2. 唯一子类选择
    
    foo:only-of-type 表示选择foo元素且foo作为foo类型唯一父级元素的子元素
    
3. 选择第一个和最后一个子代元素
    
    foo:first-child  foo:last-child 表示选择foo元素，并且foo元素作为第一个或者最后一个元素出现
    
4. 一个元素中某个元素中第一个或最后一个
    
    foo:first-of-type
    
    foo:last-of-type
    
    看似:first-child 和 :first-of-type 相同，其实不然，foo:first-child 表示foo这一组元素的第一个元素， 而：first-of-type 表示这一组中的第一组这样的类型，这样的类型是相对于父级元素来说的。
    
5. 选择美第n个元素
    
    foo:nth-child(an+b) 表示选择foo元素，且这个foo元素满足 第an+b 个元素， 其中 n=0,1,2,3… ， a表示倍数， b表示第a倍的中第b个元素
    
    :nth-child(2n) 表示偶数位， 类似 nth-child(odd)
    
    :nth-child(2n+1) 或者 nth-child(2n-1)表示奇数子代，类似 nth-child(even)

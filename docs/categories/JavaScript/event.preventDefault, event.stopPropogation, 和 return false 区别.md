---
title: event.preventDefault, event.stopPropogation, 和 return false 区别
---
# event.preventDefault, event.stopPropogation, 和 return false 区别

来源： 

[e.preventDefault()和e.stopPropagation()以及return false的作用和区别](https://www.cnblogs.com/sqh17/p/8427283.html)

前段时间开发中，遇到一个父元素和子元素都有事件时，发现会出现事件冒泡现象，虽然知道ev.stopPropagation()和ev.preventDefault()其中一个是阻止事件冒泡和阻止默认行为，却不知ev.preventDefault()和ev.stopPropagation()以及return false之间的详细区别，于是闲了就学了一下。

在此之前，先复习一下事件机制。dom事件通常会有三种情况：捕获阶段：从外向里依次查找元素。目标阶段：从当前事件源本身的操作冒泡阶段：从内到外依次触发相关的行为。

![事件捕获](/public/事件捕获.png)


从图中可知，有些情况我们不让父元素触发子元素所带来的事件。所以ev.preventDefault()和ev.stopPropagation()以及return false就出来了。

## ev.preventDefault()：

这个是阻止默认行为触发，什么是默认行为，即标签属性本身具备的功能。就是类似与a标签所带的href和submit所带的提交等等。对于默认行为，浏览器优先实行事件函数后实行默认行为。

```jsx
<body>
 <a href="http://www.baidu.com" onclick="btn()">点击</a>
 <script type="text/javascript">
    document.querySelector('a').onclick = function (ev) {
    alert('警告！');
    ev.preventDefault();
    }
 </script>
</body>
```

出现的结果是：只弹出警告的弹窗，之后没有跳转到百度页面。

兼容性处理

```jsx
function stopDefault( e ) { 
   if ( e && e.preventDefault ){ 
    e.preventDefault();  //支持DOM标准的浏览器
   } else { 
    window.event.returnValue = false;  //IE
   } 
}
```

##  ev.stopPropagation()

阻止事件冒泡。什么是事件冒泡；上一个图片已经解释清楚了。事件可以在各层级的节点中传递，不管是冒泡还是捕获，有时我们希望事件在特定节点执行完之后不再传递，可以使用事件对象的 ev.stopPropagation() 方法。

```jsx
<body>
    <br />
    <div id="parent" onclick="console.log(this.id)">
         <p>parent</p>
         <div id="child" onclick="doSomething(this,event);">
              <p>child</p>
         </div>
    </div>
    <script type="text/javascript">
        function doSomething(obj, ev){
            console.log(obj.id)
        }
    </script>
</body>
```

点击child的结果会触发事件冒泡。结果如下：

![事件冒泡](/事件冒泡.png)

如果要实现只出现child，那么就要用到ev.stopPropagation() 了。

```jsx
<body>
    <br />
    <div id="parent" onclick="console.log(this.id)">
         <p>parent</p>
         <div id="child" onclick="doSomething(this,event);">
              <p>child</p>
         </div>
    </div>
    <script type="text/javascript">
        function doSomething(obj, ev){
            console.log(obj.id);
            ev.stopPropagation();
        }
    </script>
</body>
```

结果如下：点击child只出现child。

![事件冒泡](/事件冒泡2.png)

这个有兼容性， IE8 及以前版本都不支持，IE 的事件对象包含特有的属性

```
cancelBubble
```

，只要将它赋值为 true 即可阻止事件继续。ie下可以用这个ev.cancelBubble=true。

可以封装成一个函数：

```jsx
function stopBubble(ev) {
    var ev=ev||window.event
    if(window.event) {
        ev.cancelBubble=true;   //ie阻止冒泡
    }else {
        ev.stopPropagation();   //其他浏览器组织冒泡        
    }
}
```

## return false

包含特有退出执行 `return false` 之后的所有触发事件和动作都不会被执行，有时候 `return false` 可以用来替代 `stopPropagation()` 和 `preventDefault()来阻止默认行为发生和冒泡。`

```jsx
<body>
    <br />
    <div>
         <a href="http://www.baidu.com">点击</a>
    </div>
    <script type="text/javascript">
        document.querySelector('a').onclick=function(){
            alert('警告');
            return false;
        }
    </script>
</body>
```

结果是 只出现警告的弹窗，但没有跳转到百度页面。如果将return false放到alert('警告')前面 。结果会是什么都不显示，原因是return false提到了终止事件和默认行为。

return false和ev.stopPropagation()的区别是：

return false不仅阻止了冒泡而且还阻止了事件本身。ev.stopPropagation()只阻止了冒泡。

注意：虽然return false能够替代前两个阻止默认行为和冒泡，但是也有其他作用，比如终止循环等等，所以会有意想不到的结果，因此能用ev.preventDefalut()来阻止默认行为和ev.stopPropagation()阻止冒泡最好，提高代码的高效性。

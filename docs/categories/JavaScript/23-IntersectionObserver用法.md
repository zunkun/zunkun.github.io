---
title: IntersectionObserver
date: '2023-04-09'
udate: '2023-04-09'
---
# IntersectionObserver
::: tip MDN
MDN: IntersectionObserver 接口（从属于 Intersection Observer API）提供了一种异步观察目标元素与其祖先元素或顶级文档视口（viewport）交叉状态的方法。其祖先元素或视口被称为根（root）。
:::

什么意思呢，这个接口可以监听元素是否出现在窗口中。

既然有这样功能，可以做什么呢， 比如 懒加载图片，懒加载列表内容，定位浏览位置等。


```js

const intersectionObserver = new IntersectionObserver((entries) => {
  // 如果 intersectionRatio 为 0，则目标在视野外，
  if (entries[0].intersectionRatio <= 0) {

  } else {

  }

});
// 开始监听
intersectionObserver.observe(targetElement);
```
上面方法是在监听元素以及其处理手段

##应用

### 定位

假设我们要监听当前页面浏览到哪个章节了，我们保存下来，下次进入時，直接跳转即可

```js
const intersectionObserver = new IntersectionObserver((entries) => {
  // 如果 intersectionRatio 为 0，则目标在视野外，
  entries.forEach(entry => {
    if(entry.intersectionRatio > 0) {
      // 保存进入视野中的长街id, 此处最好使用 debounce 处理一下
      setActiveChapterId(entry.target.id)
    }
  })
});


// 获取所有章节
const chapters = document.querySelector('.chapter')

// 监听章节是否进入视野范围
chapters.forEach(el => {
  intersectionObserver.observe(el);
})

```
定位操作，使用 `scrollIntoView` 方法，进行定位

```js
const chapter = document.getElementById(activeChapterId);
if(chapter) {
  chapter.scrollIntoView({ 
    behavior: "smooth", 
    block: "end", 
    inline: "nearest" 
  });
}
```

### 图片懒加载

代码来自掘金: https://juejin.cn/post/6971453092592091143

```js
if ("IntersectionObserver" in window) {
  lazyloadImages = document.querySelectorAll(".lazy");
  var imageObserver = new IntersectionObserver(function(entries, observer) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        var image = entry.target;
        image.src = image.dataset.src;
        image.classList.remove("lazy");
        imageObserver.unobserve(image);
      }
    });
  });

  lazyloadImages.forEach(function(image) {
    imageObserver.observe(image);
  });
} 

```
z

## 实例方法
* IntersectionObserver.disconnect() 使 IntersectionObserver 对象停止监听目标。

* IntersectionObserver.observe() 使 IntersectionObserver 开始监听一个目标元素。

* IntersectionObserver.takeRecords() 返回所有观察目标的 IntersectionObserverEntry 对象数组。

* IntersectionObserver.unobserve() 使 IntersectionObserver 停止监听特定目标元素。

## 参考
1. [IntersectionObserver | MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/IntersectionObserver)
2. [scrollIntoView | MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/scrollIntoView)
3. [图片懒加载 | 掘金](https://juejin.cn/post/6971453092592091143)


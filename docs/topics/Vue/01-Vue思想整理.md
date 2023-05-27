---
title: Vue思想整理
date: '2023-05-27'
udate: '2023-05-27'
---
# Vue思想整理
本文章参考《Vue.js 设计与实现》

## 常用UI描述方式
### 1. 声明式描述UI 
关注UI结果，非常直观，可维护性强，描述起来非常方便，比如下面的代码
```vue
<div @click="()=>alert('hello, world!')">click me</div>
```

### 2. 命令式描述UI
命令式描述UI执行性能高，可维护性差一些

上面的代码可以如下代码描述
```js
const div = document.createElement('div');
div.innerText = 'click me';
div.addEventListener('click', () => alert('hello, world'));
```

### 3. Vue方式
上面的命令式代码创建UI高性能式非常好的方式，但是如果UI中只做少量更改，则需要销毁旧UI，重绘新UI,效率并不理想。

好的方案式，根据 Diff 算法查找需要更新的UI项，直接更新即可，而不是所有的 DOM 元素重新渲染。


## 虚拟DOM
Vue 综合声明式描述UI的可维护性和命令式的高效，采用了虚拟DOM方式。
Vue声明UI ---编译器--->   虚拟 DOM   ---渲染器---> 真实UI

<pre class="mermaid">
sequenceDiagram
    Alice->>John: Hello John, how are you?
    John-->>Alice: Great!
    Alice-)John: See you later!
</pre>

Vue模板通过编译器生成虚拟DOM，虚拟DOM 通过渲染器生成真实的UI，这样在更新的时候，可以通过更新虚拟DOM，再渲染出来即可。

1. 虚拟DOM样式

```js
const vnode = {
  tag: 'div',
  props: {
    id: 'clickbtn',
    onclick: () => alert('click me!');
  },
  children: 'click me'
}

```
* tag: 标签，可以是 html标签，也可以是另外一个组件，比如 MyComponent
* props: 参数，可以是属性，也可以是方法
* children: 子节点，可以是字符串，可以是数组子节点


2. 组件
组件可以看做一个函数，返回一个 vnode 节点
```js
function MyComponent() {
  return vnode;
}
```

另外组件还可以是一个对象，提供渲染函数
```js
const MyComponent = {
  render() {
    return vnode;
  }
}
```

因此，vnode 还可以如下使用
```js
const vnode = {
  tag: MyComponent
}
```
## 编译器
编译器是将模板编译成 vnode, 此处不作叙述

## 渲染器
渲染器是将 vnode 渲染成真实的 vnode

```js
// 渲染 vnode 到 container 下
function renderer(vnode, container) {
  // 普通 vnode
  if(typeof vnode.tag === 'string') {
   mountElement(vnode, container)
  } else if(typeof vnode.tag === 'function') {
    // 函数描述 vnode, 组件
    mountComponent(vnode, container)
  } else if(typeof vnode.tag === 'object') {
    // 对象组件
    mountComponent(vnode, container)
  }
}


// 渲染元素
function mountElement(vnode, container) {
  // 创建元素
  const el = document.createElement(vnode.tag)

  // 挂载属性

  for(const key in vnode.props) {
    // 监听函数
    if(/^on/.test(key)) {
      el.addEventListener(key.substring(2).toLowerCase, vnode.props[key])
    } else {
      // 其他属性
      el.setAttribute(key, vnode.props[key])
    }
  }

  if(typeof vnode.children === 'string') {
    // 子节点是字符
    el.appendChild(document.createTextNode(vnode.children))
  } else if(Array.isArray(vnode.children)) {
    // 数组子节点
    vnode.children.forEach(child => renderer(child, el))
  }

  container.appendChild(el)
}


// 渲染组件
function mountComponent(vnode, container)  {
  // 子节点 vnode
  let subtree;
  if(typeof vnode.tag === 'object' && typeof vnode.tag.render === 'function') {
    // 对象式 vnode
    subtree = vnode.tag.render();
  } else if(typeof vnode.tag === 'function') {
    // 函数式 vnode
    subtree = vnode.tag()
  }

  // 将子节点挂在到 container
  renderer(subtree, container)
}

```

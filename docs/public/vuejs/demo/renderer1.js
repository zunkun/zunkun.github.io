export function renderer(vnode, container) {
  // 普通 vnode
  if (typeof vnode.tag === 'string') {
    mountElement(vnode, container);
  } else if (typeof vnode.tag === 'function') {
    // 函数描述 vnode, 组件
    mountComponent(vnode, container);
  } else if (typeof vnode.tag === 'object') {
    // 对象组件
    mountComponent(vnode, container);
  }
}

// 渲染元素
function mountElement(vnode, container) {
  // 创建元素
  const el = document.createElement(vnode.tag);

  // 挂载属性

  for (const key in vnode.props) {
    // 监听函数
    if (/^on/.test(key)) {
      el.addEventListener(key.substring(2).toLowerCase, vnode.props[key]);
    } else {
      // 其他属性
      el.setAttribute(key, vnode.props[key]);
    }
  }

  if (typeof vnode.children === 'string') {
    // 子节点是字符
    el.appendChild(document.createTextNode(vnode.children));
  } else if (Array.isArray(vnode.children)) {
    // 数组子节点
    vnode.children.forEach(child => renderer(child, el));
  }

  container.appendChild(el);
}

// 渲染组件
function mountComponent(vnode, container) {
  let subtree;
  if (typeof vnode.tag === 'object' && typeof vnode.tag.render === 'function') {
    subtree = vnode.tag.render();
  } else if (typeof vnode.tag === 'function') {
    subtree = vnode.tag();
  }

  renderer(subtree, container);
}
export default {};

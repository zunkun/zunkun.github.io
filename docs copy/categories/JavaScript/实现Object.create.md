---
title: 实现Object.create
---

# 实现Object.create

```js
function zCreate(obj) {
	function fn() {}

	fn.prototype = obj;

	return new fn();
}

```
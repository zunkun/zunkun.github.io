---
title: 实现Object.create
date: '2023-02-26'
udate: '2023-02-26'
---

# 实现Object.create

```js
function zCreate(obj) {
	function fn() {}

	fn.prototype = obj;

	return new fn();
}

```

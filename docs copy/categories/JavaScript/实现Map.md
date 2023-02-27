---
title: 实现Map
---

# 实现Map

```js
class ZMap {
	constructor() {
		this.value = [];
		this.size = 0;
	}

	_getIndex(key) {
		return this.value.findIndex((item) => {
			return item[0] === key;
		});
	}

	set(key, value) {
		let index = this._getIndex(key);

		if (index > -1) {
			this.value[index][1] = value;
		} else {
			this.value.push([key, value]);
		}

		this.size = this.value.length;
	}
	get(key) {
		let index = this._getIndex(key);
		if (index > -1) {
			return this.value[index][1];
		}

		return undefined;
	}

	has(key) {
		return this._getIndex(key) > -1;
	}

	clear() {
		this.value.length = 0;
		this.size = 0;
		return;
	}

	delete(key) {
		let index = this._getIndex(key);
		if (index > -1) {
			this.value.splice(index, 1);
			this.size = this.value.length;
		}
	}

	keys() {
		let res = [];

		this.value.forEach((item) => res.push(item[0]));
		return res;
	}

	values() {
		let res = [];

		this.value.forEach((item) => res.push(item[1]));
		return res;
	}

	entries() {
		let res = [];
		this.value.forEach((item) => {
			res.push({ [item[0]]: item[1] });
		});
		return res;
	}
}

const mymap = new ZMap();

const mymap2 = new ZMap();

mymap.set('b', 3);

console.log(mymap.get('b'));
console.log(mymap.size);
```
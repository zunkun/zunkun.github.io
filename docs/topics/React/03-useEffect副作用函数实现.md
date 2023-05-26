---
title: useEffect副作用函数实现
date: '2023-05-26'
udate: '2023-05-26'
---

# useEffect副作用函数实现
在 React 中， useState 是和 state 相关的，` useEffect(callback, deps)`, 我们要实现的只要一个参数的情况。

在 useEffect 中执行 cleanup 的原因是，在某次执行 useEffect callback 内部，依赖 关系已经发生变换，重新没有依赖的状态现在有了依赖关系，这样我们先清除所有关系，在执行 callback 时对使用的 state 建立依赖关系即可。

## 代码
```js
// effect stack, 可能出现 effect 嵌套的情况
const effectStack = [];

// 清除和 effect 相关联的副作用关系
function cleanup(effect) {
	for (const subs of effect.deps) {
		subs.delete(effect);
	}

	effect.deps.clear();
}

// 建立和 effect 相关联的副作用关系
function subscribe(effect, subs) {
	// 保存 state 和当前 effect 订阅关系
	subs.add(effect);

	// 将 state 的所有订阅关系 subs 存储在  effect 的 deps 中
	effect.deps.add(subs);
}

// useState hooks
function useState(value) {
	// 保存与当前 state 相关联的 effect
	const subs = new Set();

	const getter = () => {
		// 建立和 effect 的关系
		let effect = effectStack[effectStack.length - 1];
		if (effect) {
			subscribe(effect, subs);
		}

		return value;
	};

	const setter = (newValue) => {
		value = newValue;

		// 执行副作用函数
		for (const effect of [...subs]) {
			effect.execute();
		}
	};

	return [getter, setter];
}

// 副作用函数
function useEffect(callback) {
	function execute() {
		// 清除和当前 effect 建立的关系
		cleanup(effect);
		// 将当前 effect 推入栈顶，在执行 callback 的时候可以使用，再次建立和 effect 的关系
		effectStack.push(effect);

		try {
			// 执行函数，在函数中重新建立和effect的关系
			callback();
		} finally {
			effectStack.pop();
		}
	}

	const effect = {
		execute,
		deps: new Set(),
	};

	execute();
}

// useMemo hooks
function useMemo(callback) {
	// 建立 state 和 useEffect 的副作用关系
	const [getState, setState] = useState();

	useEffect(() => setState(callback()));

	return getState;
}

const [getName1, setName1] = useState('liuzunkun');
const [getName2, setName2] = useState('deshi');
const [shouldPrintAll, setShouldPrintAll] = useState(false);

const whoAreYou = useMemo(() => {
	if (!shouldPrintAll()) {
		return getName1();
	}

	return `${getName1()} and ${getName2()}`;
});

useEffect(() => console.log('who are you?', whoAreYou()));

setTimeout(() => {
	setName1('liuzunkun, xinyang');

	setShouldPrintAll(true);
}, 2000);

// console.log(getName1());

// useEffect(() => console.log(getName1()));


```


## 参考
1. React设计原理

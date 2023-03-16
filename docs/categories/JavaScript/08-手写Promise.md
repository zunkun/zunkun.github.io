---
title: 手写Promise
date: '2023-03-16'
udate: '2023-03-16'
---
# 手写Promise

## 代码
```js
class ZPromise {
	// 构造函数
	constructor(executor) {
		try {
			executor(this.resolve, this.reject);
		} catch (error) {
			this.reject(error);
		}
	}

	value = null;
	reason = null;
	// 初始状态
	status = 'pending';

	// pending状态下存储 then 中 onFullfilled 和 onRejected 函数
	onFullfilledCallbacks = [];
	onRejectedCallbacks = [];

	// resolve 方法
	resolve = (value) => {
		// 只有pending状态下才能够改变状态 pending  -> fufilled
		if (this.status === 'pending') {
			this.status = 'fulfilled';
			this.value = value;

			// 执行 then 函数
			while (this.onFullfilledCallbacks.length) {
				this.onFullfilledCallbacks.shift()(value);
			}
		}
	};

	reject = (reason) => {
		if (this.status === 'pending') {
			this.status = 'rejected';
			this.reason = reason;

			// 执行 then 函数
			while (this.onRejectedCallbacks.length) {
				this.onRejectedCallbacks.shift()(reason);
			}
		}
	};

	then = (onFullfilled, onRejected) => {
		// 默认 onFullfilled 和 onRejected,
		// 防止 then中没有函数的链式调佣
		onFullfilled =
			typeof onFullfilled === 'function' ? onFullfilled : (value) => value;
		onRejected =
			typeof onRejected === 'function' ? onRejected : (reason) => reason;

		// then 链式调用，返回一个 ZPromise 对象
		// nextResolve, nextReject 是下一个 then 调用使用的 resolve 和 reject 方法
		// 此处需要提前处理
		const promise = new ZPromise((nextResolve, nextReject) => {
			if (this.status === 'fulfilled') {
				// 创建微任务，可以获取promise值
				queueMicrotask(() => {
					try {
						// 获取当前直接结果，成功回调结果
						const nextData = onFullfilled(this.value);

						// 传给下一个 then 回调
						resolvePromise(promise, nextData, nextResolve, nextReject);
					} catch (error) {
						// 执行过程中出现错误，执行 reject 方法
						nextReject(error);
					}
				});
			} else if (this.status === 'rejected') {
				queueMicrotask(() => {
					try {
						// 获取成功回调结果
						const nextData = onRejected(this.value);
						resolvePromise(promise, nextData, nextResolve, nextReject);
					} catch (error) {
						nextReject(error);
					}
				});
			} else {
				// pending
				// 异步回调中使用 resolve 和 reject ， 则需要存储 onFullfilled 和 onRejected 执行任务
				// 等待调用
				this.onFullfilledCallbacks.push(() => {
					queueMicrotask(() => {
						try {
							// 获取成功回调结果
							const nextData = onFullfilled(this.value);
							resolvePromise(promise, nextData, nextResolve, nextReject);
						} catch (error) {
							nextReject(error);
						}
					});
				});

				this.onRejectedCallbacks.push(() => {
					queueMicrotask(() => {
						try {
							// 获取成功回调结果
							const nextData = onRejected(this.value);
							resolvePromise(promise, nextData, nextResolve, nextReject);
						} catch (error) {
							nextReject(error);
						}
					});
				});
			}
		});

		return promise;
	};

	// ZPromise resolve 方法
	static resolve(parameters) {
		if (parameters instanceof ZPromise) {
			return parameters;
		}

		return new ZPromise((resolve) => {
			resolve(parameters);
		});
	}

	static reject(reason) {
		return new ZPromise((resolve, reject) => {
			reject(reason);
		});
	}
}

function resolvePromise(promise, nextData, nextResolve, nextReject) {
	if (promise === nextData) {
		throw new TypeError('检测到循环引用Zpromise类型');
	}

	if (nextData instanceof ZPromise) {
		nextData.then(nextResolve, nextReject);
	} else {
		nextResolve(nextData);
	}
}

```

## 参考
[从一道让我失眠的 Promise 面试题开始，深入分析 Promise 实现细节](https://juejin.cn/post/6945319439772434469#heading-20)

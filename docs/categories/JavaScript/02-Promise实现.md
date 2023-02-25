---
title: Promise实现
---

# Promise实现

```js
class ZPromise {
	static pending = 'pending';
	static fulfilled = 'fulfilled';
	static rejected = 'rejected';
	constructor(executor) {
		this.status = ZPromise.pending;

		this.value = undefined;
		this.reason = undefined;

		this.callbacks = [];

		executor(this.resolve.bind(this), this.reject.bind(this));
	}

	resolve(value) {
		if (value instanceof ZPromise) {
			value.then(this.resolve.bind(this), this.reject.bind(this));
			return;
		}

		this.value = value;
		this.status = ZPromise.fulfilled;

		this.callbacks.forEach((cb) => this.handler(cb));
	}

	reject(reason) {
		if (reason instanceof ZPromise) {
			reason.then(this.resolve.bind(this), this.reject.bind(this));
			return;
		}
		this.status = ZPromise.rejected;
		this.reason = reason;
		this.callbacks.forEach((cb) => this.handler(cb));
	}

	then(onFulfilled, onRejected) {
		// this.callbacks.push({ onFulfilled, onRejected });

		return new ZPromise((nextResolve, nextReject) => {
			this.handler({
				nextResolve,
				nextReject,
				onFulfilled,
				onRejected,
			});
		});
	}

	handler(callback) {
		const { onFulfilled, onRejected, nextResolve, nextReject } = callback;

		if (this.status === ZPromise.pending) {
			this.callbacks.push(callback);
			return;
		}

		if (this.status === ZPromise.fulfilled) {
			const nextValue = onFulfilled ? onFulfilled(this.value) : undefined;
			nextResolve(nextValue);
			return;
		}

		if (this.status === ZPromise.rejected) {
			const nextReason = onRejected ? onRejected(this.reason) : undefined;

			nextReject(nextReason);
			return;
		}
	}
}

function fetchData(success) {
	return new ZPromise((resolve, reject) => {
		setTimeout(() => {
			console.log({ success });
			if (success) {
				resolve('zunkun promise');
			} else {
				reject('error promise');
			}
		}, 3000);
	});
}

// fetchData(true).then((data) => {
// 	console.log({ data });
// });

fetchData(true)
	.then(
		(data) => {
			console.log({ b: 2, data });
			return 33333;
		},
		(reason) => {
			console.log({ reason });
		}
	)
	.then((data2) => console.log({ data2 }));

```
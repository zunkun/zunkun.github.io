---
title: 堆Heap
---

# 堆Heap

## 堆是什么

堆(Heap)是计算机科学中一类特殊的数据结构的统称

堆通常是一个可以被看做一棵完全二叉树的数组对象，如下图：

![heap1.png](/heap1.png)

总是满足下列性质：

- 堆中某个结点的值总是不大于或不小于其父结点的值
- 堆总是一棵完全二叉树

堆又可以分成最大堆和最小堆：

- 最大堆：每个根结点，都有根结点的值大于两个孩子结点的值
- 最小堆：每个根结点，都有根结点的值小于孩子结点的值

## **二、操作**

堆的元素存储方式，按照完全二叉树的顺序存储方式存储在一个一维数组中，如下图：

![heap11.png](/heap11.png)


用一维数组存储则如下：

```jsx
[0, 1, 2, 3, 4, 5, 6, 7, 8]
```

1. 根据完全二叉树的特性，可以得到如下特性：
- 数组零坐标代码的是堆顶元素
- 一个节点的父亲节点的坐标等于其坐标除以2整数部分
- 一个节点的左节点等于其本身节点坐标 * 2 + 1
- 一个节点的右节点等于其本身节点坐标 * 2 + 2

根据上述堆的特性，下面构建最小堆的构造函数和对应的属性方法：

## **插入**

将值插入堆的底部，即数组的尾部，当插入一个新的元素之后，堆的结构就会被破坏，因此需要堆中一个元素做上移操作

将这个值和它父节点进行交换，直到父节点小于等于这个插入的值，大小为`k`的堆中插入元素的时间复杂度为`O(logk)`

如下图所示，22节点是新插入的元素，然后进行上移操作：

![heap2.png][/heap2.png)

## 删除

常见操作是用数组尾部元素替换堆顶，这里不直接删除堆顶，因为所有的元素会向前移动一位，会破坏了堆的结构

然后进行下移操作，将新的堆顶和它的子节点进行交换，直到子节点大于等于这个新的堆顶，删除堆顶的时间复杂度为`O(logk)`

整体如下图操作：

![heap3.png](/heap3.png)

最小堆

```jsx
class MinHeap {
	constructor(arr = []) {
		this.heap = arr;
		this._buildHeap();
	}

	peek() {
		return this.heap[0];
	}

	pop() {
		this.heap[0] = this.heap.pop();
		this._shiftDown(0);
	}

	size() {
		return this.heap.length;
	}

	_swap(i, j) {
		var temp = this.heap[i];
		this.heap[i] = this.heap[j];
		this.heap[j] = temp;
	}

	_getParentIndex(index) {
		return (index - 1) >> 1;
	}

	_getLeftIndex(index) {
		return 2 * index + 1;
	}

	_getRightIndex(index) {
		return 2 * index + 2;
	}

	insert(num) {
		this.heap.push(num);
		this._shiftUp(this.size() - 1);
	}

	_shiftUp(index) {
		if (index === 0) return;
		let parentIndex = this._getParentIndex(index);

		if (this.heap[parentIndex] > this.heap[index]) {
			this._swap(parentIndex, index);

			this._shiftUp(parentIndex);
		}
	}

	_shiftDown(index) {
		let leftIndex = this._getLeftIndex(index);
		let rightIndex = this._getRightIndex(index);

		let targetIndex = index;

		if (
			leftIndex < this.size() &&
			this.heap[targetIndex] > this.heap[leftIndex]
		) {
			targetIndex = leftIndex;
		}

		if (
			rightIndex < this.size() &&
			this.heap[targetIndex] > this.heap[rightIndex]
		) {
			targetIndex = rightIndex;
		}

		if (targetIndex !== index) {
			this._swap(index, targetIndex);
			this._shiftDown(targetIndex);
		}
	}

	_buildHeap() {
		let index = Math.floor((this.size() - 1 - 1) / 2);
		while (index >= 0) {
			this._shiftDown(index);
			index--;
		}
	}

	getHeap() {
		return this.heap;
	}
}

var arr = [
	3, 5, 3, 0, 8, 6, 1, 5, 8, 6, 2, 4, 9, 4, 7, 0, 1, 8, 9, 7, 3, 1, 2, 5, 9, 7,
	4, 0, 2, 6,
];

let myheap = new MinHeap(arr);

console.log(myheap.getHeap());
```

## **时间复杂度**

关于堆的插入和删除时间复杂度都是`Olog(n)`，原因在于包含n个节点的完全二叉树，树的高度不会超过`log2n`

堆化的过程是顺着节点所在路径比较交换的，所以堆化的时间复杂度跟树的高度成正比，也就是`Olog(n)`，插入数据和删除堆顶元素的主要逻辑就是堆化

## **总结**

- 堆是一个完全二叉树
- 堆中每一个节点的值都必须大于等于(或小于等于)其子树中每个节点的值
- 对于每个节点的值都大于等于子树中每个节点值的堆，叫作“大顶堆”
- 对于每个节点的值都小于等于子树中每个节点值的堆，叫作“小顶堆”
- 根据堆的特性，我们可以使用堆来进行排序操作，也可以使用其来求第几大或者第几小的值
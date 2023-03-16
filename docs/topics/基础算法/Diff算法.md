---
title: Diff算法
date: '2023-03-06'
udate: '2023-03-06'
---
# Diff算法
研究本算法的缘由是做文档变更比较。文档两个历史版本比较，需要指出哪些是新增，哪些被删除了，哪些没有变更。这就需要字符串的比较算法。

这个算法我只看懂了一半。

## 最长公共子串 LCS
最长公共子串(Longest Common Subsequence)， 简称LCS。其定义如下：

假设有两个字符串 S1, S2, 使得 LCS 中的每个元素都按照 S1 S2 的顺序排列的子序列。例如

```SHELL
S1=ABCDEF
S2=ACDEG
LCS=ACDE
```

## 算法
1. 计算最长子串长度矩阵
2. 回溯矩阵获得最长子串序列

### LCS 矩阵
假设 `i from 0 -> len(S1)`, `j from 0 -> len(S2)`,  `f(i, j)` 表示 `S1[0...i]` 和 `S2[0, ...j]` 字符串的最长公共子串长度。 则有：

$$
f(i, j) = \left\{
  \begin{array}{l}
    0 & \mbox{for} & i=0  or j = 0   \\ 
   1 + f(i-1, j-1) & \mbox{for} & S1[i-1] = S2[j-1] \\
   max(f(i-1, j), f(i, j-1)) & \mbox{for}  & otherwise
  \end{array}\right.


$$

```js
// 计算最长公共子串长度
function computeLCSLength(text1 = '', text2 = '') {
	const lcs = [];

	const m = text1.length;
	const n = text2.length;

	// 矩阵置空
	for (let i = 0; i <= m; i++) {
		lcs[i] = [];
		for (let j = 0; j < n; j++) {
			lcs[i][j] = 0;
		}
	}

	// 计算

	for (let i = 0; i <= m; i++) {
		for (let j = 0; j <= n; j++) {
			if (i === 0 || j === 0) {
				lcs[i][j] = 0;
			} else if (text1[i - 1] === text2[j - 1]) {
				lcs[i][j] = 1 + lcs[i - 1][j - 1];
			} else {
				lcs[i][j] = Math.max(lcs[i - 1][j], lcs[i][j - 1]);
			}
		}
	}

	return lcs;
}

```

### 最长公共子串计算
```js
// 回溯查找最长公共子串
function findLCSString(text1 = '', text2 = '') {
	const lcs = computeLCSLength(text1, text2);

	let i = text1.length;
	let j = text2.length;
	const result = [];

	while (i && j) {
		if (text1[i - 1] === text2[j - 1]) {
			result.push(text2[j - 1]);
			i -= 1;
			j -= 1;
		} else if (lcs[i - 1][j] <= lcs[i][j - 1]) {
			j -= 1;
		} else {
			i -= 1;
		}
	}

	return result.reverse().join('');
}
```


## 参考
1. [Diffing](https://florian.github.io/diffing/)

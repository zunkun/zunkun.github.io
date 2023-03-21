---
title: "BM46\_最小的K个数"
date: '2023-03-21'
udate: '2023-03-21'
---
# BM46 最小的K个数
## 解法一

```ts
/**
 * 代码中的类名、方法名、参数名已经指定，请勿修改，直接返回方法规定的值即可
 *
 * @param input int整型一维数组
 * @param k int整型
 * @return int整型一维数组
 */
export function GetLeastNumbers_Solution(input: number[], k: number): number[] {
  // write code here
  const mins = [];
  const indexs = [];
  const len = input.length;
  for (var i = 0; i < k; i++) {
    let j = 0;
    let min = undefined;
    let minIndex = -1;
    if(i >= input.length) return mins;
    while (j < len) {
      if (indexs.indexOf(j) > -1) {
        j++;
        continue;
      }
      if (min === undefined || input[j] < min) {
        min = input[j];
        minIndex = j;
      }
      j++;
    }
    if (minIndex > -1) {
      indexs.push(minIndex);
      mins.push(input[minIndex]);
    }
  }
  return mins;
}
```

## 小顶堆
```ts
/**
 * 代码中的类名、方法名、参数名已经指定，请勿修改，直接返回方法规定的值即可
 *
 * @param input int整型一维数组
 * @param k int整型
 * @return int整型一维数组
 */

function swap(input: number[], i: number, j: number) {
  var temp: number = input[i];
  input[i] = input[j];
  input[j] = temp;
}

function shiftDown(input: number[], index: number) {
  let len = input.length;
  let leftIndex = 2 * index + 1;
  let rightIndex = 2 * index + 2;

  let targetIndex = index;

  if (leftIndex < len && input[targetIndex] > input[leftIndex]) {
    targetIndex = leftIndex;
  }
  if (rightIndex < len && input[targetIndex] > input[rightIndex]) {
    targetIndex = rightIndex;
  }

  if (targetIndex !== index) {
    swap(input, index, targetIndex);
    shiftDown(input, targetIndex);
  }
}
export function GetLeastNumbers_Solution(input: number[], k: number): number[] {
  // write code here

  if (input.length <= k) return input;

  for (var i = Math.floor((input.length - 1 - 1) / 2); i >= 0; i--) {
    shiftDown(input, i);
  }

  var res = [];
  for (var i = 0; i < k; i++) {
    res.push(input[0]);
    input[0] = input.pop();
    shiftDown(input, 0);
  }
  return res;
}

```

---
title: "BM9\_删除链表的倒数第n个节点"
date: '2023-03-21'
udate: '2023-03-21'
---
# BM9 删除链表的倒数第n个节点

## 描述

给定一个链表，删除链表的倒数第 n 个节点并返回链表的头指针例如，

给出的链表为: 1→2→3→4→5, n= 2*n*=2.删除了链表的倒数第 n*n* 个节点之后,链表变为1→2→3→5.

数据范围： 链表长度  10000≤*n*≤1000，链表中任意节点的值满足 1000≤*val*≤100

要求：空间复杂度 O(1)*O*(1)，时间复杂度 O(n)*O*(*n*)备注：

题目保证 n*n* 一定是有效的

## 示例1

输入：
```bash
输入：{1,2},2
返回值：{2}

```
## 代码

```js
/*class ListNode {
 *     val: number
 *     next: ListNode | null
 *     constructor(val?: number, next?: ListNode | null) {
 *         this.val = (val===undefined ? 0 : val)
 *         this.next = (next===undefined ? null : next)
 *     }
 * }
 */

/**
 * 代码中的类名、方法名、参数名已经指定，请勿修改，直接返回方法规定的值即可
 * 
 * @param head ListNode类 
 * @param n int整型 
 * @return ListNode类
 */
export function removeNthFromEnd(head: ListNode, n: number): ListNode {
    // write code here
    
    var temparr = [];
    var headnode = new ListNode();
    headnode.next = head;
    
    while(head) {
        temparr.push(head)
        head = head.next;
    }
    
    var len = temparr.length;
//     数组数目小于删除位数
    if(len === n) {
        headnode.next = temparr[0]?.next;
    } else  if(len >= n+1) {
       temparr[len -(n+1)].next = temparr[len -n]?.next;
    }   
    
    return headnode.next;
}
```

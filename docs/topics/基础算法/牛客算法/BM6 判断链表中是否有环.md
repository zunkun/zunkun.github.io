---
title: "BM6\_判断链表中是否有环"
date: '2023-02-26'
udate: '2023-02-26'
---
# BM6 判断链表中是否有环
## 描述

判断给定的链表中是否有环。如果有环则返回true，否则返回false。

数据范围：链表长度 0 \le n \le 100000≤*n*≤10000，链表中任意节点的值满足 |val| <= 100000∣*val*∣<=100000

要求：空间复杂度 O(1)*O*(1)，时间复杂度 O(n)*O*(*n*)

输入分为两部分，第一部分为链表，第二部分代表是否有环，然后将组成的head头结点传入到函数里面。-1代表无环，其它的数字代表有环，这些参数解释仅仅是为了方便读者自测调试。实际在编程时读入的是链表的头节点。

例如输入{3,2,0,-4},1时，对应的链表结构如下图所示：

![BM6](/img/BM6.png){zoom}

可以看出环的入口结点为从头结点开始的第1个结点（注：头结点为第0个结点），所以输出true。

```jsx
class ListNode {
      val: number
      next: ListNode | null
      constructor(val?: number, next?: ListNode | null) {
          this.val = (val===undefined ? 0 : val)
          this.next = (next===undefined ? null : next)
      }
  }
 
```

## 使用表记录

```jsx
export function hasCycle(head: ListNode): boolean {
    // write code here
    var visitedArray = []
    while(head) {
        if(visitedArray.indexOf(head) > -1) return true;
        visitedArray.push(head)
        head = head.next;
    }
    
    return false;
    
}
```

时间复杂度O(N), 空间复杂度O(N)

使用快慢指针

```js
export function hasCycle(head: ListNode): boolean {
    // write code here
    var fast: ListNode = head;
    var slow: ListNode = head;
    
    while(fast && fast.next) {
        fast = fast.next.next;
        slow = slow.next;
        
        if(fast === slow) return true;
    }    

    return false;  
}

```

## 阅读

[深入理解快慢指针算法 -- 链表环路检测](https://zhuanlan.zhihu.com/p/361049436)

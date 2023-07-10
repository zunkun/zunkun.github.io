---
title: setTimeout和setInterval最小delay时间
date: '2023-07-09'
udate: '2023-07-09'
---

# setTimeout 和 setInterval 最小 delay 时间

## 背景

假设有如下代码

```js
let last = Date.now();
let times = 100;
let timer = setInterval(() => {
  const now = Date.now();
  console.log(`last: ${last}, now: ${now}, delay: ${now - last}`);
  last = now;
  if (times-- <= 0) clearInterval(timer);
}, 0);
```

## 分析

浏览器环境中

```js
last: 1688892782875, now: 1688892782876, delay: 1
last: 1688892782876, now: 1688892782877, delay: 1
last: 1688892782877, now: 1688892782878, delay: 1
last: 1688892782878, now: 1688892782879, delay: 1
last: 1688892782879, now: 1688892782883, delay: 4
last: 1688892782883, now: 1688892782887, delay: 4
last: 1688892782887, now: 1688892782891, delay: 4
last: 1688892782891, now: 1688892782895, delay: 4
last: 1688892782895, now: 1688892782899, delay: 4
last: 1688892782899, now: 1688892782903, delay: 4
last: 1688892782903, now: 1688892782907, delay: 4
```

nodjs 环境中

```js
last: 1688892833766, now: 1688892833767, delay: 1
last: 1688892833767, now: 1688892833768, delay: 1
last: 1688892833768, now: 1688892833770, delay: 2
last: 1688892833770, now: 1688892833772, delay: 2
last: 1688892833772, now: 1688892833773, delay: 1
last: 1688892833773, now: 1688892833774, delay: 1
last: 1688892833774, now: 1688892833776, delay: 2
last: 1688892833776, now: 1688892833776, delay: 0
last: 1688892833776, now: 1688892833777, delay: 1
last: 1688892833777, now: 1688892833779, delay: 2
```

## 结论

1. 浏览器中稳定后大概有个 `4ms` 时间最小间隔
2. nodejs 中 大概 `1-2ms` 时间间隔
